from PIL import Image
import numpy as np

# 이미지 불러오기
image_path = 'target.png'
image = Image.open(image_path).convert("RGBA")

# 목표 색상 설정 (RGB 형식)
target_color = (90, 156, 6)  # #5a9c06 색상에 해당

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

# 결과 이미지 저장
transparent_image.save('transparent_image.png')
