$srcFolder = 'src';
$distFolder = 'dist';

Write-Host 'Clearing dist folder';
Remove-Item -Path $distFolder -Recurse;

Write-Host 'Coping static assets files';
Copy-Item -Path $srcFolder -Destination $distFolder -Exclude "*.ts" -Recurse;

Write-Host 'Building ts files';
tsc