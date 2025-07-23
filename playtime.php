<?php
header('Content-Type: application/json');

// Calea către userdata.json din PlayTime (MODIFICĂ dacă e altundeva)
$sourceFile = '../../plugins/PlayTime/userdata.json';

// Calea unde va fi salvat fișierul procesat (pentru site)
$targetFile = '../data/userdata.json';

// Verifică dacă fișierul există
if (!file_exists($sourceFile)) {
    http_response_code(404);
    echo json_encode(["error" => "Fișierul source nu a fost găsit."]);
    exit;
}

// Încarcă datele brute
$data = json_decode(file_get_contents($sourceFile), true);
if (!$data || !is_array($data)) {
    http_response_code(500);
    echo json_encode(["error" => "Eroare la parsarea JSON-ului."]);
    exit;
}

// Formatează rezultatul pentru leaderboard
$players = [];

foreach ($data as $entry) {
    $players[] = [
        "username" => $entry['lastName'],
        "uuid" => $entry['uuid'],
        "playtime_minutes" => floor($entry['time'] / 60)  // convertim din secunde în minute
    ];
}

// Sortăm descrescător după playtime
usort($players, fn($a, $b) => $b['playtime_minutes'] - $a['playtime_minutes']);

// Pregătim output-ul
$output = [
    "last_updated" => date("Y-m-d H:i:s"),
    "players" => $players
];

// Salvează în JSON pentru frontend
file_put_contents($targetFile, json_encode($output, JSON_PRETTY_PRINT));

// Returnează și în API
echo json_encode($output);
