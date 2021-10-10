function wrapSVG (cfg, img, annotations) {
   return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
   <svg
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:cc="http://creativecommons.org/ns#"
      xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
      xmlns:svg="http://www.w3.org/2000/svg"
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd"
      xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape"
      width="${cfg.width}px"
      height="${cfg.height}px"
      viewBox="0 0 ${cfg.width} ${cfg.height}"
      version="1.1">

     <g>
       <image
          y="0"
          x="0"
          xlink:href="data:image/png;base64,${img}"
          preserveAspectRatio="none"
          height="${cfg.height}px"
          width="${cfg.width}px" />
       ${annotations}
     </g>
   </svg>`
}

const annotationBox = ({ x, y, w, h, cfg = {} }) => {
   const dft = {
      strokeWidth: '2',
      variant: 'primary',
      ...cfg,
   }

   let clr = ''
   switch (dft.variant) {
      case 'primary':
         clr = '#0B344E'
         break
      case 'secondary':
         clr = '#758D9B'
         break
      case 'success':
         clr = '#43AA8B'
         break
      case 'warning':
         clr = '#F5D380'
         break
      case 'danger':
         clr = '#E24646'
         break
      case 'light':
         clr = '#E4E9EF'
         break
      case 'dark':
         clr = '#162425'
         break
      default:
         throw new Error('unknown variant: ' + dft.variant)
   }

   return `
<rect
   style="stroke:${clr};stroke-width:${dft.strokeWidth}px;stroke-opacity:1;fill-opacity:0"
   width="${w}px"
   height="${h}px"
   x="${x}px"
   y="${y}px" />`}

module.exports.annotate = (config, baseBuff) => {
   const baseRaw = baseBuff.toString('base64')

   const aas = []
   for (const an of config.annotations) {
      var aux
      switch (an.kind) {
         case 'box':
            aas.push(annotationBox(an))
            break

         default:
            throw new Error('unknown annotation kind: ' + an.kind)
      }
   }

   return Buffer.from(wrapSVG(config, baseRaw, aas.join('\n')), 'utf-8')
}
