Add-Type -AssemblyName System.Drawing

function Generate-EmIcon([int]$size, [string]$outputPath) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

    # Fondo transparente
    $g.Clear([System.Drawing.Color]::Transparent)

    # 1. Círculo azul plano sólido (CERO degradados, CERO bordes, CERO sombras)
    $blueBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 2, 132, 199)) # #0284C7
    $g.FillEllipse($blueBrush, ($size * 0.02), ($size * 0.02), ($size * 0.96), ($size * 0.96))

    # 2. Letra "E": Amarillo naranjoso plano (#F59E0B), más alta y estilizada
    $g.TranslateTransform(($size / 2), ($size / 2))
    $g.ScaleTransform(0.85, 1.25)
    $g.TranslateTransform(-($size / 2), -($size / 2))

    $fontSize = $size * 0.55
    $font = New-Object System.Drawing.Font "Arial Black", $fontSize, ([System.Drawing.FontStyle]::Bold), ([System.Drawing.GraphicsUnit]::Pixel)

    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center

    $yellowOrangeBrush = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(255, 245, 158, 11)) # #F59E0B

    # Dibujar letra "E" plana directamente sin sombras ni bordes
    $g.DrawString("E", $font, $yellowOrangeBrush, (New-Object System.Drawing.RectangleF 0, ($size * -0.01), $size, $size), $sf)

    # Reset transform
    $g.ResetTransform()

    # Asegurar directorio de salida
    $dir = [System.IO.Path]::GetDirectoryName($outputPath)
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }

    $bmp.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose()
    $bmp.Dispose()
    Write-Output "OK: $outputPath ($($size)x$($size))"
}

# Generar iconos
Generate-EmIcon 192 "c:\Users\HP\OneDrive\Archivos U\Antigravity\App Educativa\eduaventura\public\assets\images\icon-192.png"
Generate-EmIcon 512 "c:\Users\HP\OneDrive\Archivos U\Antigravity\App Educativa\eduaventura\public\assets\images\icon-512.png"
Generate-EmIcon 64  "c:\Users\HP\OneDrive\Archivos U\Antigravity\App Educativa\eduaventura\public\favicon.png"
Generate-EmIcon 32  "c:\Users\HP\OneDrive\Archivos U\Antigravity\App Educativa\eduaventura\public\favicon-32.png"
