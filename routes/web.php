<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\VocabController;
use App\Http\Controllers\PracticeController;
use Illuminate\Support\Facades\Route;

// Public read-only routes for everyone (guests & users)
Route::get('/', [VocabController::class, 'index'])->name('home');
Route::get('/vocabs', [VocabController::class, 'index'])->name('vocabs.index');

// Protected routes (only for authenticated users)
Route::middleware('auth')->group(function () {
    Route::post('/vocabs', [VocabController::class, 'store'])->name('vocabs.store');
    Route::put('/vocabs/{vocab}', [VocabController::class, 'update'])->name('vocabs.update');
    Route::delete('/vocabs/{vocab}', [VocabController::class, 'destroy'])->name('vocabs.destroy');

    // Practice routes
    Route::get('/practice', [PracticeController::class, 'index'])->name('practice.index');
    Route::post('/practice/{vocab}/status', [PracticeController::class, 'updateStatus'])->name('practice.status');

    Route::get('/dashboard', function () {
        return redirect()->route('vocabs.index');
    })->name('dashboard');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
