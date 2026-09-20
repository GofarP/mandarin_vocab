<?php

namespace App\Http\Controllers;

use App\Models\Vocab;
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

        return Inertia::render('Practice/Index', [
            'vocabs' => $vocabs,
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
}
