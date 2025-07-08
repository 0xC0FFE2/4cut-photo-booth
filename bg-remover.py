from PIL import Image
import numpy as np
import os
import glob

# 목표 색상 설정 (RGB 형식)
target_color = (90, 156, 6)  # #5a9c06 색상에 해당

# 현재 폴더의 모든 PNG 파일 찾기
png_files = glob.glob("*.png")

# 처리할 파일이 없는 경우
if not png_files:
    print("현재 폴더에 PNG 파일이 없습니다.")
    exit()

print(f"총 {len(png_files)}개의 PNG 파일을 처리합니다.")

# 각 PNG 파일에 대해 처리
for i, file_path in enumerate(png_files, 1):
    try:
        print(f"[{i}/{len(png_files)}] 처리 중: {file_path}")
        
        # 이미지 불러오기
        image = Image.open(file_path).convert("RGBA")
        
        # 이미지를 numpy 배열로 변환
        data = np.array(image)
        
        # RGB 채널을 분리
        r, g, b, a = data.T
        
        # 목표 색상 영역 찾기
        target_areas = (r == target_color[0]) & (g == target_color[1]) & (b == target_color[2])
        
        # 알파 채널을 0으로 설정 (투명하게 만들기)
        data[..., -1][target_areas.T] = 0
        
        # numpy 배열을 다시 이미지로 변환
        transparent_image = Image.fromarray(data)
        
        # 원본 파일명에서 확장자 제거 후 '_transparent' 추가
        filename_without_ext = os.path.splitext(file_path)[0]
        output_path = f"{filename_without_ext}_transparent.png"
        
        # 결과 이미지 저장
        transparent_image.save(output_path)
        print(f"  → 저장 완료: {output_path}")
        
    except Exception as e:
        print(f"  → 오류 발생: {file_path} - {str(e)}")

print("\n모든 파일 처리 완료!")