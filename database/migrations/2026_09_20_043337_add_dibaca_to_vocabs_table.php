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
        Schema::table('vocabs', function (Blueprint $table) {
            $table->string('dibaca', 150)->nullable()->after('pinyin');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('vocabs', function (Blueprint $table) {
            $table->dropColumn('dibaca');
        });
    }
};
