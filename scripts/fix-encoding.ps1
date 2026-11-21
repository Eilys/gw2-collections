$strict = New-Object System.Text.UTF8Encoding($false, $true)
$utf8 = New-Object System.Text.UTF8Encoding($false)
$files = Get-ChildItem src, scripts -Recurse -Include *.ts, *.tsx, *.mjs
foreach ($f in $files) {
    $bytes = [IO.File]::ReadAllBytes($f.FullName)
    try {
        $null = $strict.GetString($bytes)
    }
    catch {
        $text = [Text.Encoding]::GetEncoding(1252).GetString($bytes)
        [IO.File]::WriteAllText($f.FullName, $text, $utf8)
        Write-Host "Converti : $($f.FullName)"
    }
}
Write-Host "Termine"