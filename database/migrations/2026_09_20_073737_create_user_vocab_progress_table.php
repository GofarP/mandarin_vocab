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
        Schema::create('user_vocab_progress', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('vocab_id')->constrained()->onDelete('cascade');
            $table->enum('status', ['learning', 'memorized'])->default('learning');
            $table->timestamp('last_reviewed_at')->nullable();
            $table->timestamps();
            
            $table->unique(['user_id', 'vocab_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_vocab_progress');
    }
};
