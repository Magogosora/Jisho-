
/**
 * Draws a diagram from the pitch accent data. Returns the diagram encapsuled in a DIV.
 * 
 * @param {Hatsuon} hatsuon Pitch accent data.
 * @returns {?HTMLDivElement}
 */
function drawPitchDiagram(hatsuon) {
    const pattern = hatsuon.pattern;
    const patternName = (hatsuon.patternName).toUpperCase();
    const pitchNum = hatsuon.pitchNum;
    const morae = hatsuon.morae;
    const color = PATTERN_COLORS[patternName];

    if (pitchNum < 0) {
        return null;
    }

    let stretchFactorHeight = morae.length == 1 ? 3.5 : 3.5;
    // use the font size to calculate height and width
    let kanaElem = document.querySelector(".furigana");
    let fontSize = window.getComputedStyle(kanaElem, null).getPropertyValue('font-size');
    fontSize = parseFloat(fontSize);
    let svg_w = fontSize * pattern.length * 1.7;
    let svg_h = fontSize * stretchFactorHeight; // 4 was also nice?

    // absolute positioned container
    let pitchDiagram = document.createElement('DIV');
    pitchDiagram.className = 'pitchDiagram';
    pitchDiagram.style.position = 'relative';
    pitchDiagram.style.left = '2';
    pitchDiagram.style.top = '0';
    pitchDiagram.style.bottom = '2';
    pitchDiagram.style.marginBottom = '0'; // '-0.5em';
    pitchDiagram.style.width = svg_w + 'px';
    pitchDiagram.style.height = svg_h + 'px';

    // The svg which will be drawn to
    let namespace = 'http://www.w3.org/2000/svg';
    let svg = document.createElementNS(namespace, 'svg');
    svg.setAttribute('width', svg_w);
    svg.setAttribute('height', svg_h);

    let w = 6.5; // Dot size

    /*
        Start drawing
    */
    let points = [];
    function calculatePoints(p, i) {
        let cx = i * 100 - w * 2 / (svg_w + 5) * 100 + '%';
        let cy = p == 0 ? '85%' : '45%';
        points.push({ x: cx, y: cy });
    }

    function drawPitchDot(cx, cy, is_particle) {
        let circle = document.createElementNS(namespace, 'circle');
        circle.setAttribute('fill', is_particle ? '#eeeeee' : color);
        circle.setAttribute('stroke', is_particle ? 'black' : color);
        circle.setAttribute('stroke-width', is_particle ? '1' : '0');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', w / 2);
        svg.appendChild(circle);
    }

    function drawLine(x1, y1, x2, y2) {
        let line = document.createElementNS(namespace, 'line');
        line.setAttribute('stroke', color);
        line.setAttribute('stroke-width', '2');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        svg.appendChild(line);
    }

    function drawMora(x, y, mora) {
        let textfield = document.createElementNS(namespace, 'text');
        textfield.setAttribute('style', 'fill:black;');
        textfield.setAttribute('font-size', '0.75em');
        textfield.setAttribute('text-anchor', 'middle');
        textfield.setAttribute('x', x);
        y = parseFloat(y) - 20 + '%';
        textfield.setAttribute('y', y);
        let text = document.createTextNode(mora);
        textfield.appendChild(text);
        svg.appendChild(textfield);
    }

    let drawnPoints = pattern.length;

    for (let i = 0; i < drawnPoints; i++) {
        calculatePoints(pattern[i], (i + 1) / drawnPoints);
    }

    // Draw lines between points.
    for (let j = 0; j < points.length - 1; j++) {
        drawLine(points[j].x, points[j].y, points[j + 1].x, points[j + 1].y);
    }
    // Draw circles at points.
    for (let k = 0; k < points.length; k++) {
        drawPitchDot(points[k].x, points[k].y, k == points.length - 1);
    }

    // Draw kana above points.
    for (let l = 0; l < points.length - 1; l++) {
        drawMora(points[l].x, points[l].y, morae[l]);
    }

    // Fix height of diagram for words that consist of only one mora and start with low pitch.
    if (morae.length == 1 && pattern[0] == 0) {
        pitchDiagram.style.marginTop = -svg_h * 0.3 + 'px';
    }

    pitchDiagram.appendChild(svg);
    return pitchDiagram;
}
