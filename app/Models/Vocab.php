<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vocab extends Model
{
    use HasFactory;

    protected $fillable = [
        'hanzi',
        'pinyin',
        'dibaca',
        'meaning',
        'notes',
    ];

    /**
     * Get the users who are learning this vocab.
     */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_vocab_progress')
            ->withPivot('status', 'last_reviewed_at')
            ->withTimestamps();
    }
}
