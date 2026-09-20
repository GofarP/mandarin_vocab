<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class VocabSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $jsonPath = database_path('data/hsk.json');
        
        if (!file_exists($jsonPath)) {
            $this->command->error('File hsk.json tidak ditemukan di database/data/hsk.json');
            return;
        }

        $json = file_get_contents($jsonPath);
        $data = json_decode($json, true);

        if (!$data) {
            $this->command->error('Gagal membaca file JSON.');
            return;
        }

        $this->command->info('Mulai memasukkan ' . count($data) . ' kosakata HSK...');

        $chunks = array_chunk($data, 50);
        $totalChunks = count($chunks);

        // Hapus data lama (disable foreign key check terlebih dahulu)
        DB::statement('SET FOREIGN_KEY_CHECKS=0;');
        DB::table('vocabs')->truncate();
        DB::statement('SET FOREIGN_KEY_CHECKS=1;');

        $tr = new \Stichoza\GoogleTranslate\GoogleTranslate('id');
        $tr->setSource('en');

        foreach ($chunks as $index => $chunk) {
            $insertData = [];
            $englishMeanings = [];
            
            foreach ($chunk as $item) {
                if (isset($item['translations']['eng']) && is_array($item['translations']['eng'])) {
                    $englishMeanings[] = implode(', ', $item['translations']['eng']);
                } else {
                    $englishMeanings[] = 'unknown'; // placeholder to prevent empty line dropping
                }
            }

            $batchText = implode(" \n ", $englishMeanings);
            try {
                $translatedText = $tr->translate($batchText);
                $translatedMeanings = array_map('trim', explode("\n", $translatedText));
            } catch (\Exception $e) {
                $translatedMeanings = $englishMeanings;
            }

            foreach ($chunk as $i => $item) {
                $meaning = $translatedMeanings[$i] ?? $englishMeanings[$i];
                if (strtolower($meaning) === 'tidak diketahui' || strtolower($meaning) === 'unknown') {
                    $meaning = '';
                }

                $insertData[] = [
                    'hanzi'      => $item['hanzi'] ?? '',
                    'pinyin'     => $item['pinyin'] ?? '',
                    'dibaca'     => null,
                    'meaning'    => $meaning,
                    'notes'      => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];
            }

            DB::table('vocabs')->insert($insertData);
            $this->command->info('Memasukkan chunk ' . ($index + 1) . ' dari ' . $totalChunks);
            
            // Jeda 1 detik agar tidak terkena limit API
            sleep(1);
        }

        $this->command->info('Berhasil memasukkan semua kosakata HSK!');
    }
}
