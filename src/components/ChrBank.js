import React from 'react'


// 512 x 8x8 sprites
export default class ChrBank extends React.Component {
  spritesPerRow = 16

  downloadAsPNG(canvas) {
    const a = document.createElement("a");
    document.body.appendChild(a);
    const url = canvas.toDataURL("image/png");
    a.href = url
    a.download = `bank_${this.props.index}.png`
    a.click()
    window.URL.revokeObjectURL(url)
    a.remove()
  }

  render(){
    const canvasWidth = this.spritesPerRow * 8
    const canvasHeight = 4096 * 8 / canvasWidth

    return(
      <div>
        <button onClick={(event) => { this.downloadAsPNG(this.refs.canvas) }}>PNG</button>
        <canvas ref='canvas' width={canvasWidth} height={canvasHeight} />
      </div>
    )
  }

  componentDidMount() {
    const pallette = [
      [255,   255,   255,    0],
      [122,   172,   172,    255],
      [ 85,    85,    85,    255],
      [  0,     0,     0,    255]
    ]

    const canvas = this.refs.canvas
    const ctx    = canvas.getContext('2d')
    const sprites = this.props.sprites


    let x = 0
    let y = 0

    sprites.forEach((sprite, i) => {
      const data = []
      // 64
      sprite.pixels.forEach((colorIdx) => {
        const [r, g, b, a] = pallette[colorIdx]

        data.push(r)
        data.push(g)
        data.push(b)
        data.push(a)
      })

      const imageData = new ImageData(new Uint8ClampedArray(data), 8)

      x = (i % this.spritesPerRow) * 8
      y = Math.floor(i / this.spritesPerRow) * 8

      ctx.putImageData(imageData, x, y);
    })

  }
}
