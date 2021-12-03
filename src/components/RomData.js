import React        from 'react';

import downloadAs   from '../utils'

// components
import ExternalLink from './ExternalLink'
import ChrBank      from './ChrBank'

export default class RomData extends React.Component {
  
  nesPallette = [
    [124, 124, 124],
    [  0,   0, 252],
    [  0,   0, 188],
    [ 68,  40, 188],
    [148,   0, 132],
    [168,   0,  32],
    [168,  16,   0],
    [136,  20,   0],
    [ 80,  48,   0],
    [  0, 120,   0],
    [  0, 104,   0],
    [  0,  88,   0],
    [  0,  64,  88],
    [  0,   0,   0],
    [  0,   0,   0],
    [  0,   0,   0],
    [188, 188, 188],
    [  0, 120, 248],
    [  0,  88, 248],
    [104,  68, 252],
    [216,   0, 204],
    [228,   0,  88],
    [248,  56,   0],
    [228,  92,  16],
    [172, 124,   0],
    [  0, 184,   0],
    [  0, 168,   0],
    [  0, 168,  68],
    [  0, 136, 136],
    [  0,   0,   0],
    [  0,   0,   0],
    [  0,   0,   0],
    [248, 248, 248],
    [ 60, 188, 252],
    [104, 136, 252],
    [152, 120, 248],
    [248, 120, 248],
    [248,  88, 152],
    [248, 120,  88],
    [252, 160,  68],
    [248, 184,   0],
    [184, 248,  24],
    [ 88, 216,  84],
    [ 88, 248, 152],
    [  0, 232, 216],
    [120, 120, 120],
    [  0,   0,   0],
    [  0,   0,   0],
    [252, 252, 252],
    [164, 228, 252],
    [184, 184, 248],
    [216, 184, 248],
    [248, 184, 248],
    [248, 164, 192],
    [240, 208, 176],
    [252, 224, 168],
    [248, 216, 120],
    [216, 248, 120],
    [184, 248, 184],
    [184, 248, 216],
    [  0, 252, 252],
    [248, 216, 248],
    [  0,   0,   0],
    [  0,   0,   0]
  ]

  downloadAsCHR() {
    const { chrBytes, file } = this.props

    if (chrBytes === undefined) {
      throw new Error('chrBytes is not set')
    }

    const fileName = file.name.replace('.nes', '.chr')

    const downloadURL = window.URL.createObjectURL(new Blob(chrBytes, {type: "octet/stream"}))
    downloadAs(downloadURL, fileName)
  }

  render() {
    const { props } = this

    const { romHeader, crc32, spriteData, chrBytes, file } = props

    const romMapperLink = `https://wiki.nesdev.com/w/index.php/INES_Mapper_${romHeader.mapper.toString().padStart(3, '0')}`

    let cabinetStyle;
    if (romHeader.vsUnisystem) {
      cabinetStyle = 'Nintendo VS. System'
    } else if (romHeader.playChoice10) {
      cabinetStyle = 'PlayChoice-10'
    } else {
      cabinetStyle = 'None'
    }

    return (
      <div className='rom'>
        <fieldset>
        <legend>ROM DATA</legend>

        <table>
          <tbody>
            <tr>
              <td>CRC</td>
              <td>
                <span style={{'textTransform': 'uppercase'}}>
                  {crc32}
                </span>
              </td>
            </tr>
            <tr>
              <td>Mapper</td>
              <td>
                <ExternalLink href={romMapperLink} label={romHeader.mapper} />
              </td>
            </tr>
            <tr>
              <td>Mirroring</td>
              <td>{romHeader.mirroring}</td>
            </tr>
            <tr>
              <td>TV Color System</td>
              <td>{romHeader.tvColorSystem}</td>
            </tr>
            <tr>
              <td>prgRomBanks</td>
              <td>{romHeader.prgRomBanks}</td>
            </tr>
            {romHeader.prgRamBanks > 0 &&
              <tr>
                <td>prgRamBanks</td>
                <td>{romHeader.prgRamBanks}</td>
              </tr>
            }

            {romHeader.chrRomBanks > 0 &&
              <tr>
                <td>chrRomBanks</td>
                <td>
                  {romHeader.chrRomBanks}
                  &nbsp;
                  <button onClick={() => { this.downloadAsCHR() }}>CHR</button>
                </td>
              </tr>
            }
            <tr>
              <td>fourScreenVram</td>
              <td>{romHeader.fourScreenVram ? 'YES': 'NO'}</td>
            </tr>
            <tr>
              <td>battery</td>
              <td>{romHeader.battery ? 'YES': 'NO'}</td>
            </tr>
            <tr>
              <td>Cabinet</td>
              <td>{cabinetStyle}</td>
            </tr>
            <tr>
              <td>trainer</td>
              <td>{romHeader.trainer ? 'YES': 'NO'}</td>
            </tr>
          </tbody>
        </table>
        </fieldset>

        {romHeader.chrRomBanks > 0 &&
          <fieldset>
            <legend>CHR DATA</legend>
            <div className='spriteData'>
              {
                [...Array(romHeader.chrRomBanks)].map((e, i) => {
                  const key = [i, crc32].join('_')
                  return(
                    <div className='chrBank' key={key}>
                      <b>Bank #{i}</b>
                      <ChrBank index={i} sprites={spriteData[i]} />
                    </div>
                  )
                })
              }
            </div>
          </fieldset>
        }
      </div>
    )
  }
}
