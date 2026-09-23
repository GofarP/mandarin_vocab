<?php

namespace App\Http\Controllers;

use App\Models\Vocab;
use App\Models\CcCedict;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PracticeController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get total stats
        $totalVocabs = Vocab::count();
        $memorizedCount = $user->vocabs()->wherePivot('status', 'memorized')->count();

        // Get up to 10 vocabs that the user hasn't memorized yet
        $vocabs = Vocab::whereDoesntHave('users', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                  ->where('status', 'memorized');
        })
        ->inRandomOrder()
        ->limit(10)
        ->get();

        // Get historically memorized vocabs for the Brain Dump table
        $memorizedVocabs = $user->vocabs()
            ->wherePivot('status', 'memorized')
            ->orderByPivot('created_at', 'desc')
            ->get();

        return Inertia::render('Practice/Index', [
            'vocabs' => $vocabs,
            'memorizedVocabs' => $memorizedVocabs,
            'stats' => [
                'total' => $totalVocabs,
                'memorized' => $memorizedCount,
            ]
        ]);
    }

    public function updateStatus(Request $request, Vocab $vocab)
    {
        $request->validate([
            'status' => 'required|in:learning,memorized',
        ]);

        $user = $request->user();

        $user->vocabs()->syncWithoutDetaching([
            $vocab->id => [
                'status' => $request->status,
                'last_reviewed_at' => now(),
            ]
        ]);

        return redirect()->back();
    }

    public function storeBrainDump(Request $request)
    {
        $request->validate([
            'hanzi' => 'nullable|string|max:100',
            'pinyin' => 'required|string|max:150',
            'meaning' => 'required|string|max:500',
        ]);

        $hanzi = trim($request->input('hanzi'));
        if (empty($hanzi)) {
            $hanzi = '-'; // Fallback if user leaves it blank
        }
        $pinyin = trim($request->input('pinyin'));
        $meaning = trim($request->input('meaning'));
        
        $normalizedInput = strtolower(preg_replace('/[^a-z]/', '', \Illuminate\Support\Str::ascii($pinyin)));

        $user = $request->user();
        $vocab = null;
        
        // Try exact Hanzi match first (if they provided hanzi)
        if ($hanzi !== '-') {
            $vocab = Vocab::where('hanzi', $hanzi)->first();
        }

        // Try Exact Pinyin match
        if (!$vocab && !empty($pinyin)) {
            // Case insensitive exact match
            $vocab = Vocab::whereRaw('LOWER(pinyin) = ?', [strtolower($pinyin)])->first();
        }

        // Try Normalized Pinyin match ONLY if they typed ascii only (no tones)
        if (!$vocab && !empty($normalizedInput) && preg_match('/^[a-zA-Z\s]+$/', $pinyin)) {
            $allVocabs = Vocab::all(['id', 'hanzi', 'pinyin', 'meaning']);
            foreach ($allVocabs as $v) {
                $dbPinyin = strtolower(preg_replace('/[^a-z]/', '', \Illuminate\Support\Str::ascii($v->pinyin)));
                if ($dbPinyin === $normalizedInput) {
                    $vocab = $v;
                    break;
                }
            }
        }

        // If not found in our Vocab DB, create a new custom vocab entry for them!
        if (!$vocab) {
            $vocab = Vocab::create([
                'hanzi' => $hanzi,
                'pinyin' => $pinyin,
                'meaning' => $meaning,
            ]);
        }

        $alreadyMemorized = $user->vocabs()
            ->where('vocab_id', $vocab->id)
            ->wherePivot('status', 'memorized')
            ->exists();
        
        if (!$alreadyMemorized) {
            $user->vocabs()->syncWithoutDetaching([
                $vocab->id => [
                    'status' => 'memorized',
                    'last_reviewed_at' => now(),
                ]
            ]);
        }

        return response()->json([
            'success' => true,
            'vocab' => $vocab,
            'already_memorized' => $alreadyMemorized
        ]);
    }

    public function searchHanzi(Request $request)
    {
        $pinyin = $request->query('pinyin');
        if (empty($pinyin)) {
            return response()->json(['hanzi' => null]);
        }

        $normalizedInput = strtolower(preg_replace('/[^a-z]/', '', \Illuminate\Support\Str::ascii($pinyin)));
        
        if (empty($normalizedInput)) {
            return response()->json(['hanzi' => null]);
        }

        $cedictMatch = CcCedict::where('pinyin_normalized', $normalizedInput)->first();
        
        if ($cedictMatch) {
            return response()->json(['hanzi' => $cedictMatch->simplified]);
        }

        return response()->json(['hanzi' => null]);
    }
}
