<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CcCedict extends Model
{
    public $timestamps = false;
    protected $fillable = ['simplified', 'pinyin_numbers', 'pinyin_normalized', 'english'];
}
