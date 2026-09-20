<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vocab;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'gofar@gmail.com'],
            [
                'name' => 'Gofar',
                'password' => bcrypt('vocab@2026'),
                'email_verified_at' => now(),
            ]
        );
        
        $this->call([
            VocabSeeder::class,
        ]);
    }
}
