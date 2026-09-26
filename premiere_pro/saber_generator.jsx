/*
 * Advanced Saber & Light Sword Generator for Premiere Pro
 * This file generates procedural glowing lines with bloom and wave effects
 */

(function () {
    /**
     * Create a procedural saber/light sword effect
     * Returns pixel data for rendering
     */
    function generateSaberPixels(width, height, centerX, centerY, angle, length, thickness, colorHex, glowRadius) {
        var pixels = [];
        var r = parseInt(colorHex.substring(0, 2), 16) / 255;
        var g = parseInt(colorHex.substring(2, 4), 16) / 255;
        var b = parseInt(colorHex.substring(4, 6), 16) / 255;

        // Calculate line endpoints
        var rad = angle * Math.PI / 180;
        var cos = Math.cos(rad);
        var sin = Math.sin(rad);

        var x1 = centerX - cos * length / 2;
        var y1 = centerY - sin * length / 2;
        var x2 = centerX + cos * length / 2;
        var y2 = centerY + sin * length / 2;

        // Draw glow (outer blur)
        var glowThickness = thickness + glowRadius;
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var dist = distanceToLine(x, y, x1, y1, x2, y2);
                if (dist < glowThickness) {
                    var intensity = Math.max(0, 1 - (dist / glowThickness));
                    intensity = intensity * intensity; // Gaussian-like falloff
                    pixels.push({
                        x: x,
                        y: y,
                        r: r * intensity,
                        g: g * intensity,
                        b: b * intensity,
                        a: intensity * 0.7
                    });
                }
            }
        }

        return pixels;
    }

    /**
     * Calculate minimum distance from point to line segment
     */
    function distanceToLine(px, py, x1, y1, x2, y2) {
        var dx = x2 - x1;
        var dy = y2 - y1;
        var t = Math.max(0, Math.min(1, ((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy)));
        var closestX = x1 + t * dx;
        var closestY = y1 + t * dy;
        return Math.sqrt((px - closestX) ** 2 + (py - closestY) ** 2);
    }

    /**
     * Apply Gaussian blur for bloom effect
     */
    function applyGaussianBlur(pixels, radius, width, height) {
        var blurred = [];
        var sigma = radius / 3;
        var kernel = [];
        var sum = 0;

        // Generate Gaussian kernel
        for (var x = -radius; x <= radius; x++) {
            var weight = Math.exp(-(x * x) / (2 * sigma * sigma));
            kernel.push(weight);
            sum += weight;
        }

        // Normalize kernel
        for (var i = 0; i < kernel.length; i++) {
            kernel[i] /= sum;
        }

        // Apply horizontal blur
        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                var r = 0, g = 0, b = 0, a = 0;
                for (var kx = 0; kx < kernel.length; kx++) {
                    var sx = x + kx - radius;
                    if (sx >= 0 && sx < width) {
                        var pixel = pixels[y * width + sx];
                        if (pixel) {
                            r += pixel.r * kernel[kx];
                            g += pixel.g * kernel[kx];
                            b += pixel.b * kernel[kx];
                            a += pixel.a * kernel[kx];
                        }
                    }
                }
                blurred.push({ r: r, g: g, b: b, a: a });
            }
        }

        return blurred;
    }

    /**
     * Generate wave animation frame (Volna 2 style)
     */
    function generateWaveFrame(width, height, time, amplitude, frequency, waveLength) {
        var pixels = [];

        for (var y = 0; y < height; y++) {
            for (var x = 0; x < width; x++) {
                // Sine wave distortion
                var waveX = x + amplitude * Math.sin((x / waveLength) + time * frequency);
                var waveY = y + amplitude * Math.cos((y / waveLength) + time * frequency);

                // Clamp to bounds
                waveX = Math.max(0, Math.min(width - 1, waveX));
                waveY = Math.max(0, Math.min(height - 1, waveY));

                pixels.push({
                    x: waveX,
                    y: waveY,
                    r: 0,
                    g: Math.abs(Math.sin(time * frequency)) * 0.8,
                    b: Math.abs(Math.cos(time * frequency)) * 0.8,
                    a: 0.6
                });
            }
        }

        return pixels;
    }

    // Export functions for use in main script
    return {
        generateSaber: generateSaberPixels,
        generateWave: generateWaveFrame,
        applyBlur: applyGaussianBlur
    };
})();
