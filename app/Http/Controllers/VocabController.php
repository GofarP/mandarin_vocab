<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreVocabRequest;
use App\Http\Requests\UpdateVocabRequest;
use App\Models\Vocab;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class VocabController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $search = trim((string) $request->input('search'));

        $query = Vocab::query();

        if ($search !== '') {
            $searchNoSpaces = str_replace([' ', '-', '_'], '', $search);

            $query->where(function ($q) use ($search, $searchNoSpaces) {
                $q->where('hanzi', 'like', "%{$search}%")
                    ->orWhere('pinyin', 'like', "%{$search}%")
                    ->orWhere('dibaca', 'like', "%{$search}%")
                    ->orWhere('meaning', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%");

                if (!empty($searchNoSpaces)) {
                    $q->orWhereRaw("REPLACE(REPLACE(REPLACE(pinyin, ' ', ''), '-', ''), '_', '') LIKE ?", ["%{$searchNoSpaces}%"]);
                }
            });
        }

        $vocabs = $query->latest()->paginate(50)->withQueryString();

        return Inertia::render('Vocabs/Index', [
            'vocabs' => $vocabs,
            'filters' => [
                'search' => $search,
            ],
            'stats' => [
                'total' => Vocab::count(),
            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreVocabRequest $request): RedirectResponse
    {
        Vocab::create($request->validated());

        return redirect()->route('vocabs.index')
            ->with('success', 'Kosakata baru berhasil ditambahkan!');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateVocabRequest $request, Vocab $vocab): RedirectResponse
    {
        $vocab->update($request->validated());

        return redirect()->back()
            ->with('success', 'Kosakata berhasil diperbarui!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vocab $vocab): RedirectResponse
    {
        $vocab->delete();

        return redirect()->back()
            ->with('success', 'Kosakata berhasil dihapus!');
    }
}
