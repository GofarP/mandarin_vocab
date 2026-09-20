<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cc_cedicts', function (Blueprint $table) {
            $table->id();
            $table->string('simplified', 100);
            $table->string('pinyin_numbers', 255);
            $table->string('pinyin_normalized', 255)->index(); // Indexed for fast lookups
            $table->text('english')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cc_cedicts');
    }
};
