#!/usr/bin/env python3
"""
Script to create circular favicons from the original image
"""
from PIL import Image, ImageDraw
import os

def create_circular_favicon(input_path, output_path, size):
    """Create a circular favicon from the input image"""
    # Open the image
    img = Image.open(input_path)
    
    # Resize to the desired size
    img = img.resize((size, size), Image.Resampling.LANCZOS)
    
    # Create a circular mask
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse((0, 0, size, size), fill=255)
    
    # Apply the mask to create circular image
    output = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    output.paste(img, (0, 0))
    output.putalpha(mask)
    
    # Save the result
    output.save(output_path, 'PNG')
    print(f"Created circular favicon: {output_path} ({size}x{size})")

def main():
    input_file = "public/favicon.jpg"
    
    # Create circular favicons in different sizes
    sizes = [16, 32, 192, 512]
    
    for size in sizes:
        output_file = f"public/favicon-{size}x{size}.png"
        create_circular_favicon(input_file, output_file, size)
    
    # Create the ICO file from 32x32
    img_32 = Image.open("public/favicon-32x32.png")
    img_32.save("public/favicon.ico", format='ICO', sizes=[(32, 32)])
    print("Created favicon.ico")

if __name__ == "__main__":
    main()
