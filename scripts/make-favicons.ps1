Add-Type -AssemblyName System.Drawing
$pub = "C:\Users\javir\Documents\TALEMTUCLASS\public"
$brand = Join-Path $pub "brand"
New-Item -ItemType Directory -Force -Path $brand | Out-Null
$src = Join-Path $pub "logo-talemtumclass.png"
$img = [System.Drawing.Bitmap]::FromFile($src)
$crop = New-Object System.Drawing.Rectangle(413, 178, 513, 418)

foreach ($s in 512,192,180,48,32,16) {
  $bmp = New-Object System.Drawing.Bitmap($s, $s, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::Transparent)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $margin = [int]($s * 0.06)
  $avail = $s - 2 * $margin
  $scale = [Math]::Min($avail / 513, $avail / 418)
  $dw = [int][Math]::Round(513 * $scale)
  $dh = [int][Math]::Round(418 * $scale)
  $dx = [int](($s - $dw) / 2)
  $dy = [int](($s - $dh) / 2)
  $dest = New-Object System.Drawing.Rectangle($dx, $dy, $dw, $dh)
  $g.DrawImage($img, $dest, $crop, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $out = Join-Path $brand ("talentumclass-{0}.png" -f $s)
  $bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  Write-Output "guardado $out"
}
$img.Dispose()
Write-Output "listo"
