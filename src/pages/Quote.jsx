import { useState, useRef } from 'react'

const MATERIALS = ['PLA', 'PETG', 'TPU', 'ABS', 'ASA']

const MATERIAL_COLORS = {
  PLA: [
    { name: 'Black', hex: '#1A1A1A' },
    { name: 'Grey', hex: '#8E8E93' },
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Red', hex: '#E33E33' },
    { name: 'Blue', hex: '#2886E2' },
    { name: 'Green', hex: '#479A5C' },
    { name: 'Yellow', hex: '#F8DA4E' },
    { name: 'Orange', hex: '#F28C28' },
    { name: 'Pink', hex: '#EFCCDF' },
    { name: 'Purple', hex: '#7B2D8B' },
    { name: 'Glow (Green)', hex: '#39FF14', glow: true },
    { name: 'Wood', hex: '#A0714F', wood: true },
  ],
  PETG: [
    { name: 'Black', hex: '#1A1A1A' },
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Translucent (Blue)', hex: '#87CEEB', translucent: true },
  ],
  TPU: [
    { name: 'Black', hex: '#1A1A1A' },
  ],
  ABS: [
    { name: 'Blue', hex: '#2886E2' },
  ],
  ASA: [
    { name: 'Black', hex: '#1A1A1A' },
  ],
}

const QUALITY_LEVELS = [
  { value: 0, label: 'Prototype', sublabel: '(fast)' },
  { value: 1, label: 'Normal', sublabel: '' },
  { value: 2, label: 'Quality', sublabel: '' },
  { value: 3, label: 'High Quality', sublabel: '' },
]

export default function Quote() {
  const [file, setFile] = useState(null)
  const [wallStrength, setWallStrength] = useState(2)
  const [infill, setInfill] = useState(20)
  const [material, setMaterial] = useState('PLA')
  const [color, setColor] = useState('Black')
  const [quality, setQuality] = useState(1)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleMaterialChange = (mat) => {
    setMaterial(mat)
    setColor(MATERIAL_COLORS[mat][0].name)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) setFile(droppedFile)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const availableColors = MATERIAL_COLORS[material]

  return (
    <div className="h-[100svh] bg-gray-50 pt-3 sm:pt-5 pb-4 sm:pb-5 overflow-hidden flex flex-col">
      <div className="st-shell max-w-6xl flex-1 flex flex-col min-h-0 w-full">
        <div className="st-page-header shrink-0 mb-4 sm:mb-5">
          <span className="st-section-kicker text-st-blue !mb-2 sm:!mb-2.5">Instant Quote</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-st-black mb-2 sm:mb-3">
            Get Instant Quote
          </h1>
          <p className="text-base sm:text-lg text-st-black/70 max-w-2xl mx-auto leading-relaxed text-center">
            Upload your 3D file, configure your print settings, and get a price in seconds.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 sm:gap-2.5 flex-1 min-h-0 lg:flex-initial"
        >
          {/*
            Mobile: grid grows + scrolls inside the viewport.
            lg+: grid is only as tall as its content so the CTA sits directly under the fields (no flex dead space).
          */}
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 overflow-y-auto lg:flex-none lg:overflow-visible lg:min-h-0 overscroll-contain">
            <div className="lg:col-span-3 space-y-4 min-h-0 lg:overflow-hidden">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-st-black/70 mb-3">
                  Upload 3D File
                </label>
                <div
                  className={`relative border-2 border-dashed rounded-xl p-6 sm:p-7 text-center transition-all duration-300 cursor-pointer min-h-[130px] sm:min-h-[140px] flex flex-col justify-center ${
                    dragOver
                      ? 'border-st-blue bg-st-blue/5'
                      : file
                        ? 'border-st-green bg-st-green/5'
                        : 'border-gray-300 hover:border-st-blue hover:bg-st-blue/3'
                  }`}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".stl,.obj,.3mf,.step,.stp"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="hidden"
                  />

                  {file ? (
                    <div className="flex items-center justify-center gap-4">
                      <svg className="w-8 h-8 text-st-green" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div className="text-left">
                        <p className="font-semibold text-st-black">{file.name}</p>
                        <p className="text-sm text-st-black/50">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg className="w-9 h-9 mx-auto mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-sm text-st-black/70 font-medium mb-1">
                        Drag & drop your file here, or click to browse
                      </p>
                      <p className="text-xs text-st-black/60">
                        STL, OBJ, 3MF, STEP supported
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-st-black/70 mb-3">
                  Material
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {MATERIALS.map((mat) => (
                    <button
                      key={mat}
                      type="button"
                      onClick={() => handleMaterialChange(mat)}
                      className={`inline-flex items-center justify-center min-h-[42px] py-2.5 px-3 rounded-lg font-semibold text-sm leading-none transition-all duration-300 border-2 cursor-pointer ${
                        material === mat
                          ? 'bg-st-blue text-white border-st-blue shadow-lg shadow-st-blue/20'
                          : 'bg-white text-st-black/70 border-gray-200 hover:border-st-blue/40'
                      }`}
                    >
                      {mat}
                    </button>
                  ))}
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-st-black/70">
                      Colour
                    </label>
                    <span className="text-xs font-medium text-st-blue">{color}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableColors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColor(c.name)}
                        className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-md transition-all duration-200 cursor-pointer ${
                          color === c.name
                            ? 'ring-2 ring-st-blue ring-offset-2 scale-110'
                            : 'hover:scale-105'
                        } ${c.border ? 'border-2 border-gray-300' : ''}`}
                        style={{
                          backgroundColor: c.hex,
                          ...(c.glow ? { boxShadow: `0 0 12px ${c.hex}` } : {}),
                          ...(c.wood ? { backgroundImage: 'linear-gradient(135deg, #A0714F 0%, #C49A6C 40%, #8B5E3C 60%, #A0714F 100%)' } : {}),
                          ...(c.translucent ? { opacity: 0.7 } : {}),
                        }}
                        title={c.name}
                        aria-label={c.name}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4 min-h-0 lg:overflow-hidden">
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-st-black/70">
                    Wall Strength
                  </label>
                  <span className="text-xl font-bold text-st-blue">{wallStrength}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={6}
                  step={1}
                  value={wallStrength}
                  onChange={(e) => setWallStrength(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-st-black/45 mt-2">
                  <span>1 (Thin)</span>
                  <span>6 (Thick)</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-st-black/70">
                    Infill Density
                  </label>
                  <span className="text-xl font-bold text-st-blue">{infill}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={infill}
                  onChange={(e) => setInfill(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-st-black/45 mt-2">
                  <span>0% (Hollow)</span>
                  <span>100% (Solid)</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-st-black/70 mb-3">
                  Print Quality
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min={0}
                    max={3}
                    step={1}
                    value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-3 gap-1">
                    {QUALITY_LEVELS.map(({ value, label, sublabel }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setQuality(value)}
                        className={`text-center cursor-pointer bg-transparent border-none transition-colors ${
                          quality === value ? 'text-st-blue' : 'text-st-black/45'
                        }`}
                      >
                        <span className="block text-[10px] sm:text-xs font-semibold">{label}</span>
                        {sublabel && <span className="block text-[10px] sm:text-xs">{sublabel}</span>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 bg-white rounded-2xl border border-slate-200 px-4 py-3 sm:px-5 sm:py-3.5 flex flex-col items-center gap-1.5 sm:gap-2 lg:flex-row lg:justify-center lg:gap-6">
            <button
              type="submit"
              className="st-btn st-btn-primary text-base px-10"
            >
              Get My Quote
            </button>
            <p className="text-xs sm:text-sm font-bold text-st-black/70 text-center lg:text-left lg:max-w-md">
              Upload your file &middot; Pick your settings &middot; Get a price in seconds
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
