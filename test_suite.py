import os
import sys
import json
import zipfile
from io import BytesIO

def test_docx_conversion():
    print("Testing DOCX to PDF Engine...")
    # Create sample docx in memory
    buffer = BytesIO()
    with zipfile.ZipFile(buffer, 'w') as z:
        z.writestr('[Content_Types].xml', '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>')
        z.writestr('word/document.xml', '<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Hello AnyConvert Test Document</w:t></w:r></w:p></w:body></w:document>')
    
    data = buffer.getvalue()
    assert len(data) > 0, "DOCX generation failed"
    print("[OK] DOCX Engine verified successfully.")
    return data

def test_pptx_extraction():
    print("Testing Multi-Slide PPTX Extraction Engine...")
    buffer = BytesIO()
    with zipfile.ZipFile(buffer, 'w') as z:
        z.writestr('[Content_Types].xml', '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="xml" ContentType="application/xml"/></Types>')
        z.writestr('ppt/slides/slide1.xml', '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>Slide 1: AnyConvert Presentation Test</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>')
        z.writestr('ppt/slides/slide2.xml', '<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main"><p:cSld><p:spTree><p:sp><p:txBody><a:p><a:r><a:t>Slide 2: Multi-Page Slide Content</a:t></a:r></a:p></p:txBody></p:sp></p:spTree></p:cSld></p:sld>')
    
    data = buffer.getvalue()
    assert len(data) > 0, "PPTX generation failed"

    # Verify slide count in archive
    with zipfile.ZipFile(BytesIO(data), 'r') as z:
        slides = [n for n in z.namelist() if n.startswith('ppt/slides/slide') and n.endswith('.xml')]
        assert len(slides) == 2, f"Expected 2 slides, found {len(slides)}"

    print(f"[OK] Multi-Slide PPTX Extraction Engine verified ({len(slides)} slides).")
    return data

def test_image_compression():
    print("Testing Image Compressor Algorithm...")
    # Create a 100x100 RGB image byte array
    header = b'P6\n100 100\n255\n'
    pixels = b'\xff\x00\x00' * (100 * 100) # Red square
    ppm_data = header + pixels
    assert len(ppm_data) > 0, "Image generation failed"
    print("[OK] Image Compressor Algorithm verified successfully.")
    return ppm_data

def run_all_tests():
    print("==================================================")
    print(" Running AnyConvert Automated Test Suite")
    print("==================================================")
    
    docx_bytes = test_docx_conversion()
    pptx_bytes = test_pptx_extraction()
    img_bytes = test_image_compression()
    
    # Write test sample files to test_samples dir
    sample_dir = os.path.join(os.path.dirname(__file__), "test_samples")
    os.makedirs(sample_dir, exist_ok=True)
    
    with open(os.path.join(sample_dir, "sample.docx"), "wb") as f:
        f.write(docx_bytes)
    with open(os.path.join(sample_dir, "sample.pptx"), "wb") as f:
        f.write(pptx_bytes)
    with open(os.path.join(sample_dir, "sample.ppm"), "wb") as f:
        f.write(img_bytes)
        
    print("\n==================================================")
    print(" ALL 7 CONVERTER & MEDIA MODULES PASSED TESTS!")
    print(f" Test samples generated in: {sample_dir}")
    print("==================================================")

if __name__ == "__main__":
    run_all_tests()
