<?php
$targetDir = "uploads/";
$worksFile = "works.json";

if (!file_exists($targetDir)) {
  mkdir($targetDir, 0755, true);
}

if (isset($_FILES["image"]) && isset($_POST["description"])) {
  $image = $_FILES["image"];
  $desc = htmlspecialchars(trim($_POST["description"]), ENT_QUOTES);

  $imageName = time() . "_" . basename($image["name"]);
  $targetFile = $targetDir . $imageName;

  if (move_uploaded_file($image["tmp_name"], $targetFile)) {
    $entry = [
      "image" => $targetFile,
      "description" => $desc
    ];

    $existing = [];
    if (file_exists($worksFile)) {
      $existing = json_decode(file_get_contents($worksFile), true);
    }

    $existing[] = $entry;
    file_put_contents($worksFile, json_encode($existing, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

    echo "✅ Το έργο προστέθηκε!";
  } else {
    echo "❌ Σφάλμα στο ανέβασμα της εικόνας.";
  }
} else {
  echo "❌ Ελλιπή δεδομένα.";
}
?>
