<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use App\Models\CcCedict;
use ZipArchive;

class ImportCcCedict extends Command
{
    protected $signature = 'cedict:import';
    protected $description = 'Download and import CC-CEDICT dictionary to database';

    public function handle()
    {
        $this->info('Starting CC-CEDICT import process...');
        
        $url = 'https://www.mdbg.net/chinese/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip';
        $zipPath = storage_path('app/cedict.zip');
        $txtFileName = 'cedict_ts.u8';
        $txtPath = storage_path('app/' . $txtFileName);

        if (!file_exists($txtPath)) {
            $this->info("Downloading from $url ...");
            $response = Http::timeout(300)->get($url);
            
            if (!$response->successful()) {
                $this->error('Failed to download CC-CEDICT.');
                return 1;
            }
            
            file_put_contents($zipPath, $response->body());
            $this->info("Downloaded. Extracting...");
            
            $zip = new ZipArchive;
            if ($zip->open($zipPath) === true) {
                $zip->extractTo(storage_path('app/'), $txtFileName);
                $zip->close();
                unlink($zipPath);
            } else {
                $this->error('Failed to extract zip.');
                return 1;
            }
        } else {
            $this->info("CC-CEDICT file already exists. Skipping download.");
        }

        $this->info("Parsing and inserting into database...");
        
        CcCedict::truncate();
        
        $handle = fopen($txtPath, 'r');
        $batch = [];
        $count = 0;
        
        while (($line = fgets($handle)) !== false) {
            $line = trim($line);
            if (empty($line) || str_starts_with($line, '#')) {
                continue;
            }
            
            // Format: Traditional Simplified [pin1 yin1] /English equivalent 1/equivalent 2/
            if (preg_match('/^(.+?)\s+(.+?)\s+\[(.+?)\]\s+\/(.+)\/$/', $line, $matches)) {
                $simplified = $matches[2];
                $pinyinNumbers = $matches[3];
                $english = $matches[4];
                
                $pinyinNormalized = strtolower(preg_replace('/[^a-z]/', '', $pinyinNumbers));
                
                $batch[] = [
                    'simplified' => $simplified,
                    'pinyin_numbers' => $pinyinNumbers,
                    'pinyin_normalized' => $pinyinNormalized,
                    'english' => mb_substr($english, 0, 1000) // Truncate if too long
                ];
                
                $count++;
                
                if (count($batch) >= 5000) {
                    CcCedict::insert($batch);
                    $batch = [];
                    $this->info("Inserted $count records...");
                }
            }
        }
        
        if (count($batch) > 0) {
            CcCedict::insert($batch);
        }
        
        fclose($handle);
        
        $this->info("Successfully imported $count words to cc_cedicts table!");
        return 0;
    }
}
