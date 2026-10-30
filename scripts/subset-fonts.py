"""마루 부리·D2Coding을 실제 쓰는 글자만 남겨 서브셋 (PRD 6.4: 폰트 로딩 경량화).

사용: python3 scripts/subset-fonts.py   (pip install fonttools brotli 필요)
카피를 바꾸면 다시 실행해 src/assets/fonts/ 를 갱신한다.
"""
import pathlib, subprocess, sys

root = pathlib.Path(__file__).resolve().parent.parent
text = ''.join(p.read_text(encoding='utf-8') for p in (root / 'src').rglob('*.ts*'))
chars = ''.join(sorted(set(text) | set(' 0123456789,.%₩·…–—"\'()?!:/+-=○✓')))
out = root / 'src/assets/fonts'
out.mkdir(parents=True, exist_ok=True)
(out / 'chars.txt').write_text(chars, encoding='utf-8')

jobs = [
    ('@kfonts/maruburi/MaruBuri-Bold.woff2', 'MaruBuri-Bold.subset.woff2'),
    ('@kfonts/d2coding/D2Coding.woff2', 'D2Coding.subset.woff2'),
]
for src, dst in jobs:
    subprocess.run([sys.executable, '-m', 'fontTools.subset', str(root / 'node_modules' / src),
                    f'--text-file={out / "chars.txt"}', '--flavor=woff2', '--layout-features=*',
                    f'--output-file={out / dst}'], check=True)
    print(dst, (out / dst).stat().st_size // 1024, 'KB')
(out / 'chars.txt').unlink()
