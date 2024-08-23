from django.core.files.uploadedfile import InMemoryUploadedFile
from io import BytesIO
from PIL import Image
import requests

#? set watermarks
def set_watermark(subject_type, file_path, ext_file, file_name):
	watermark_image = Image.open(file_path)
	x, y = watermark_image.size
	if subject_type == 5:
		x = 300
		y = 350
		
		# box = (0, 0, 700, 1000)
		# watermark_image = watermark_image.crop(box)
		watermark_image = watermark_image.resize((x, y), Image.ANTIALIAS)
		x, y = watermark_image.size

		watermark = requests.get('http://villarzan.com/watermarks/thumb.png')
		watermark = Image.open(BytesIO(watermark.content))
		watermark_image.paste(watermark, (x-100,y-50), watermark)

	else:
		watermark = requests.get('http://villarzan.com/watermarks/v_3nMtbtf.png')
		watermark = Image.open(BytesIO(watermark.content))
		watermark_image.paste(watermark, (x-320,y-100), watermark)

	buffer = BytesIO()
	if ext_file == 'jpg':
		buffer.content_type = 'image/jpeg'
		ext_file = 'jpeg'

	watermark_image.save(buffer, ext_file)
	watermark_image = InMemoryUploadedFile(buffer, None, file_name, f'image/{ext_file}', buffer.tell, None)
	return watermark_image

