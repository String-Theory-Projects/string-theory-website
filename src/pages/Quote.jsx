import { useState, useRef, useMemo, useEffect } from 'react'
import { Box3, Vector3, Color, MeshStandardMaterial } from 'three'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

// ─── Constants ────────────────────────────────────────────────────────────────

const ALLOWED_EXTS = new Set(['stl', '3mf'])

const WHATSAPP_URL = 'https://wa.me/2348160080202'

const MATERIALS = ['PLA', 'PETG', 'TPU', 'ABS', 'ASA']

const MATERIAL_COLORS = {
  PLA: [
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Black', hex: '#1A1A1A' },
    { name: 'Grey', hex: '#8E8E93' },
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
    { name: 'White', hex: '#FFFFFF', border: true },
    { name: 'Black', hex: '#1A1A1A' },
    { name: 'Translucent (Blue)', hex: '#87CEEB', translucent: true },
  ],
  TPU: [{ name: 'Black', hex: '#1A1A1A' }],
  ABS: [{ name: 'Blue', hex: '#2886E2' }],
  ASA: [{ name: 'Black', hex: '#1A1A1A' }],
}

const QUALITY_LEVELS = [
  { value: 0, label: 'Prototype', sublabel: '(fast)' },
  { value: 1, label: 'Normal', sublabel: '' },
  { value: 2, label: 'Quality', sublabel: '' },
  { value: 3, label: 'High Quality', sublabel: '' },
]

// Bambu Lab P1S, 0.4 mm hardened steel nozzle
const QUALITY_LAYER_HEIGHTS = [0.3, 0.2, 0.15, 0.1]
const QUALITY_PRINT_SPEEDS  = [200, 150, 100, 60]

const MATERIAL_TEMPS = { PLA: 215, PETG: 235, ABS: 245, TPU: 220, ASA: 250 }

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function getExt(file) {
  return file.name.split('.').pop().toLowerCase()
}

function fmtNGN(amount) {
  return `NGN ${amount.toLocaleString('en-NG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * CuraEngine writes ;TIME:<seconds> and ;Filament used: <X>m in the
 * G-code header. Parse from the first ~100 KB which always contains them.
 */
function parseGcode(gcodeBuffer) {
  const bytes  = new Uint8Array(gcodeBuffer, 0, Math.min(gcodeBuffer.byteLength, 100_000))
  const text   = new TextDecoder().decode(bytes)
  const time   = text.match(/;TIME:(\d+)/)
  const fil    = text.match(/;Filament used:\s*([\d.]+)m/)
  return {
    printTimeSeconds: time ? parseInt(time[1], 10) : 0,
    filamentLengthMm: fil  ? parseFloat(fil[1]) * 1000 : 0,
  }
}

function calcQuote(filamentLengthMm, printTimeSeconds, material, cfg) {
  const r          = (cfg.filamentDiameterMm ?? 1.75) / 2
  const volumeCm3  = (Math.PI * r * r * filamentLengthMm) / 1000
  const density    = cfg.materialDensities?.[material] ?? 1.24
  const grams      = volumeCm3 * density
  const printHours = printTimeSeconds / 3600

  const mc  = (grams / 1000) * cfg.filamentPricePerKg * (cfg.materialMultipliers?.[material] ?? 1)
  const mtc = printHours * cfg.machineRatePerHour
  const ec  = cfg.printerPowerKw * printHours * cfg.electricityRatePerKwh
  const scf = cfg.baseFee * (cfg.complexityMultiplier ?? 1.2)

  const total = mc + mtc + ec + scf
  const final = total * (1 + cfg.profitMargin)

  const r2 = (n) => Math.round(n * 100) / 100
  return { final: r2(final) }
}

// ─── 3-D sub-components (rendered inside an R3F Canvas) ──────────────────────

function STLModel({ geometry, colorHex }) {
  const scale = useMemo(() => {
    if (!geometry) return 1
    geometry.computeBoundingSphere()
    const r = geometry.boundingSphere?.radius ?? 1
    return r > 0 ? 2 / r : 1
  }, [geometry])

  if (!geometry) return null
  return (
    <mesh geometry={geometry} scale={scale}>
      <meshStandardMaterial color={colorHex} roughness={0.4} metalness={0.05} />
    </mesh>
  )
}

function ThreeMFModel({ object3d, colorHex }) {
  const processed = useMemo(() => {
    if (!object3d) return null
    const clone = object3d.clone(true)
    const box   = new Box3().setFromObject(clone)
    if (!box.isEmpty()) {
      const center = new Vector3()
      box.getCenter(center)
      clone.position.sub(center)
      const size = new Vector3()
      box.getSize(size)
      const maxDim = Math.max(size.x, size.y, size.z)
      if (maxDim > 0) clone.scale.setScalar(4 / maxDim)
    }
    return clone
  }, [object3d])

  useEffect(() => {
    if (!processed) return
    const color  = new Color(colorHex)
    const mats   = []
    processed.traverse((child) => {
      if (child.isMesh) {
        const mat = new MeshStandardMaterial({ color, roughness: 0.4, metalness: 0.05 })
        child.material = mat
        mats.push(mat)
      }
    })
    return () => mats.forEach((m) => m.dispose())
  }, [processed, colorHex])

  if (!processed) return null
  return <primitive object={processed} />
}

function ModelCanvas({ geometry, object3d, colorHex }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 45 }}
      style={{ width: '100%', height: '100%' }}
      gl={{ antialias: true }}
    >
      <color attach="background" args={['#f8fafc']} />
      <ambientLight intensity={0.7} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <directionalLight position={[-5, -3, -5]} intensity={0.25} />
      {geometry  && <STLModel    geometry={geometry}   colorHex={colorHex} />}
      {object3d  && <ThreeMFModel object3d={object3d}  colorHex={colorHex} />}
      <OrbitControls
        autoRotate
        autoRotateSpeed={1.5}
        enablePan={false}
        minDistance={3}
        maxDistance={20}
      />
    </Canvas>
  )
}

// ─── Quote result card ────────────────────────────────────────────────────────

function QuoteResult({ quote, onReset }) {
  return (
    <div className="w-full flex flex-col gap-3 sm:gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-3 sm:gap-6">
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <span className="text-3xl sm:text-4xl font-bold text-st-black tabular-nums">
            {fmtNGN(quote.final)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-st-yellow text-st-black px-2.5 py-1 rounded-full">
            Estimate
          </span>
        </div>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-st-blue font-bold hover:underline mx-auto sm:mx-0"
        >
          Adjust settings
        </button>
      </div>

      <div
        className="rounded-xl border-2 border-st-blue/40 bg-st-light-blue/80 px-4 py-3.5 sm:px-5 sm:py-4 shadow-sm"
        role="note"
      >
        <p className="text-center text-sm sm:text-base font-bold text-st-black leading-snug">
          <span className="text-st-blue">Bulk &amp; repeat orders:</span>{' '}
          printing more of the same part usually lowers your cost per piece. Tell us your quantity and we&apos;ll quote a better rate.
        </p>
        <p className="text-center mt-3">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-st-green hover:text-st-green/80 underline decoration-2 underline-offset-2"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Chat on WhatsApp
          </a>
        </p>
      </div>
    </div>
  )
}

// ─── Spinner icon ─────────────────────────────────────────────────────────────

function Spinner({ className = 'w-4 h-4' }) {
  return (
    <svg className={`${className} animate-spin`} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function Quote() {
  // File state
  const [file,           setFile]          = useState(null)
  const [fileBuffer,     setFileBuffer]    = useState(null)
  const [geometry,       setGeometry]      = useState(null)
  const [object3d,       setObject3d]      = useState(null)
  const [fileError,      setFileError]     = useState(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [dragOver,       setDragOver]      = useState(false)

  // Print settings
  const [material,     setMaterial]     = useState('PLA')
  const [color,        setColor]        = useState('White')
  const [quality,      setQuality]      = useState(1)
  const [wallStrength, setWallStrength] = useState(2)
  const [infill,       setInfill]       = useState(20)

  // Quote state
  const [sliceStatus,   setSliceStatus]   = useState('idle') // idle | slicing | done | error
  const [sliceProgress, setSliceProgress] = useState(0)
  const [quote,         setQuote]         = useState(null)
  const [sliceError,    setSliceError]    = useState(null)
  const [pricing,       setPricing]       = useState(null)

  const fileInputRef  = useRef(null)
  const slicerRef     = useRef(null)
  const geometryRef   = useRef(null)

  // Load pricing config once on mount
  useEffect(() => {
    fetch('/pricing.json')
      .then((r) => r.json())
      .then(setPricing)
      .catch(() => console.error('Could not load pricing.json'))
    return () => {
      const s = slicerRef.current
      slicerRef.current = null
      void s?.destroy?.()
    }
  }, [])

  // Slice-affecting controls: clear estimate so we never show a stale price vs. sliders.
  useEffect(() => {
    setQuote(null)
    setSliceStatus((s) => (s === 'done' ? 'idle' : s))
  }, [material, quality, wallStrength, infill])

  // Resolved hex for the currently selected colour
  const colorHex = useMemo(() => {
    const cs = MATERIAL_COLORS[material]
    return (cs.find((c) => c.name === color) ?? cs[0]).hex
  }, [material, color])

  const hasModel = !!(geometry || object3d)

  // ── File handling ──────────────────────────────────────────────────────────

  async function processFile(f) {
    const ext = getExt(f)
    if (!ALLOWED_EXTS.has(ext)) {
      setFileError('Only STL and 3MF files are accepted.')
      return
    }
    setFileError(null)
    setFile(f)
    setQuote(null)
    setSliceStatus('idle')
    setSliceError(null)
    setLoadingPreview(true)

    // Dispose previous geometry
    if (geometryRef.current) {
      geometryRef.current.dispose()
      geometryRef.current = null
    }
    setGeometry(null)
    setObject3d(null)

    try {
      const buf = await f.arrayBuffer()
      setFileBuffer(buf)

      if (ext === 'stl') {
        const { STLLoader } = await import('three/addons/loaders/STLLoader.js')
        const geo = new STLLoader().parse(buf.slice(0))
        geo.computeBoundingSphere()
        const c = geo.boundingSphere?.center
        if (c) geo.translate(-c.x, -c.y, -c.z)
        geometryRef.current = geo
        setGeometry(geo)
      } else {
        const { ThreeMFLoader } = await import('three/addons/loaders/3MFLoader.js')
        const loader = new ThreeMFLoader()
        const url    = URL.createObjectURL(new Blob([buf], { type: 'model/3mf' }))
        await new Promise((resolve, reject) =>
          loader.load(url, (obj) => { URL.revokeObjectURL(url); setObject3d(obj); resolve() }, undefined, reject)
        )
      }
    } catch (err) {
      setFileError('Could not read the file. Please try another.')
      console.error(err)
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }

  const handleMaterialChange = (mat) => {
    setMaterial(mat)
    setColor(MATERIAL_COLORS[mat][0].name)
  }

  const clearFile = () => {
    if (geometryRef.current) { geometryRef.current.dispose(); geometryRef.current = null }
    setFile(null)
    setFileBuffer(null)
    setGeometry(null)
    setObject3d(null)
    setQuote(null)
    setSliceStatus('idle')
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  // ── Slicing ────────────────────────────────────────────────────────────────

  const handleGetQuote = async (e) => {
    e.preventDefault()
    if (!file || !fileBuffer || !pricing) return

    setSliceStatus('slicing')
    setSliceProgress(0)
    setSliceError(null)
    setQuote(null)

    try {
      const [{ CuraWASM }, { resolveDefinition }] = await Promise.all([
        import('cura-wasm'),
        import('cura-wasm-definitions'),
      ])

      const prev = slicerRef.current
      slicerRef.current = null
      if (prev) {
        try {
          await prev.destroy()
        } catch {
          /* ignore */
        }
      }

      const speed = QUALITY_PRINT_SPEEDS[quality]
      const layer = QUALITY_LAYER_HEIGHTS[quality]

      const slicer = new CuraWASM({
        definition: resolveDefinition('ultimaker2'),
        overrides: [
          // Machine: Bambu P1S build volume, 0.4 mm nozzle
          { key: 'machine_width',  value: 256 },
          { key: 'machine_depth',  value: 256 },
          { key: 'machine_height', value: 256 },
          { key: 'machine_nozzle_size', value: 0.4 },
          // Quality (Cura 4.x keys — wrong names were ignored before)
          { key: 'layer_height',   value: layer },
          { key: 'layer_height_0', value: layer },
          { key: 'speed_print',    value: speed },
          { key: 'speed_infill',   value: speed },
          // Form settings
          { key: 'wall_line_count',       value: wallStrength },
          { key: 'infill_sparse_density', value: infill },
          // 1.75 mm filament + temp (Ultimaker defs default to 2.85 mm)
          { scope: 'e0', key: 'material_diameter', value: 1.75 },
          { scope: 'e0', key: 'material_print_temperature', value: MATERIAL_TEMPS[material] },
        ],
        transfer: false,
        verbose: false,
      })

      slicerRef.current = slicer
      slicer.on('progress', (pct) => setSliceProgress(Math.round(pct)))

      const { gcode } = await slicer.slice(fileBuffer.slice(0), getExt(file))
      await slicer.destroy()
      slicerRef.current = null

      const { printTimeSeconds, filamentLengthMm } = parseGcode(gcode)

      if (printTimeSeconds === 0 && filamentLengthMm === 0) {
        throw new Error('Slice returned no data — the model may be too small, invalid, or outside the build volume.')
      }

      setQuote(calcQuote(filamentLengthMm, printTimeSeconds, material, pricing))
      setSliceStatus('done')
    } catch (err) {
      setSliceStatus('error')
      setSliceError(err.message ?? 'Slicing failed. Please try a different model or settings.')
      console.error(err)
    }
  }

  const availableColors = MATERIAL_COLORS[material]

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="h-[100svh] bg-gray-50 pt-3 sm:pt-5 pb-4 sm:pb-5 overflow-hidden flex flex-col">
      <div className="st-shell max-w-6xl flex-1 flex flex-col min-h-0 w-full">

        {/* Page header */}
        <div className="st-page-header shrink-0 mb-4 sm:mb-5">
          <span className="st-section-kicker text-st-blue !mb-2 sm:!mb-2.5">Instant Quote</span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-st-black mb-2 sm:mb-3">
            Get Instant Quote
          </h1>
          <p className="text-base sm:text-lg text-st-black/70 max-w-2xl mx-auto leading-relaxed text-center">
            Upload your 3D file, configure your print settings, and receive a price estimate in seconds.
          </p>
        </div>

        <form
          onSubmit={handleGetQuote}
          className="flex flex-col gap-2 sm:gap-2.5 flex-1 min-h-0 lg:flex-initial"
        >
          <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4 lg:gap-5 overflow-y-auto lg:flex-none lg:overflow-visible overscroll-contain">

            {/* ── Left column ── */}
            <div className="lg:col-span-3 space-y-4 min-h-0 lg:overflow-hidden">

              {/* Upload / 3-D preview card */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-st-black/70">
                    Upload 3D File
                  </label>
                  {file && !loadingPreview && (
                    <button
                      type="button"
                      onClick={clearFile}
                      className="text-xs text-st-black/40 hover:text-st-red transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Drop zone / viewer */}
                <div
                  className={`relative rounded-xl transition-all duration-300 ${
                    hasModel
                      ? 'h-[260px] sm:h-[300px] overflow-hidden border border-slate-100'
                      : [
                          'border-2 border-dashed p-6 sm:p-7 min-h-[130px] sm:min-h-[140px]',
                          'flex flex-col items-center justify-center text-center cursor-pointer',
                          dragOver
                            ? 'border-st-blue bg-st-blue/5'
                            : loadingPreview
                            ? 'border-slate-200 bg-slate-50'
                            : fileError
                            ? 'border-st-red/50 bg-st-red/5'
                            : 'border-gray-300 hover:border-st-blue hover:bg-st-blue/3',
                        ].join(' ')
                  }`}
                  onDragOver={(e) => { e.preventDefault(); if (!hasModel) setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => !hasModel && !loadingPreview && fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".stl,.3mf"
                    onChange={(e) => { const f = e.target.files[0]; if (f) processFile(f) }}
                    className="hidden"
                  />

                  {hasModel ? (
                    <>
                      <ModelCanvas
                        geometry={geometry}
                        object3d={object3d}
                        colorHex={colorHex}
                      />
                      {/* Overlay: file name + size */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                        <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full max-w-[65%] truncate">
                          {file.name}
                        </span>
                        <span className="bg-black/40 backdrop-blur-sm text-white text-[10px] px-2.5 py-1 rounded-full">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                      </div>
                    </>
                  ) : loadingPreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <Spinner className="w-7 h-7 text-st-blue" />
                      <p className="text-sm text-st-black/60">Loading preview…</p>
                    </div>
                  ) : (
                    <>
                      <svg className="w-9 h-9 mb-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                      </svg>
                      <p className="text-sm text-st-black/70 font-medium mb-1">
                        Drag & drop your file here, or click to browse
                      </p>
                      <p className="text-xs text-st-black/40">STL and 3MF only</p>
                      {fileError && (
                        <p className="text-xs text-st-red font-semibold mt-2">{fileError}</p>
                      )}
                    </>
                  )}
                </div>

                {hasModel && (
                  <p className="text-[10px] text-st-black/30 mt-2 text-center tracking-wide">
                    Drag to orbit · Scroll to zoom · Colour updates live
                  </p>
                )}
              </div>

              {/* Material + Colour */}
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
                    <label className="text-xs font-bold uppercase tracking-wider text-st-black/70">Colour</label>
                    <span className="text-xs font-medium text-st-blue">{color}</span>
                  </div>
                  <div className="flex flex-wrap gap-2.5">
                    {availableColors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColor(c.name)}
                        title={c.name}
                        aria-label={c.name}
                        className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-md transition-all duration-200 cursor-pointer ${
                          color === c.name ? 'ring-2 ring-st-blue ring-offset-2 scale-110' : 'hover:scale-105'
                        } ${c.border ? 'border-2 border-gray-300' : ''}`}
                        style={{
                          backgroundColor: c.hex,
                          ...(c.glow        ? { boxShadow: `0 0 12px ${c.hex}` } : {}),
                          ...(c.wood        ? { backgroundImage: 'linear-gradient(135deg,#A0714F 0%,#C49A6C 40%,#8B5E3C 60%,#A0714F 100%)' } : {}),
                          ...(c.translucent ? { opacity: 0.7 } : {}),
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="lg:col-span-2 space-y-4 min-h-0 lg:overflow-hidden">

              {/* Wall strength */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-st-black/70">Wall Strength</label>
                  <span className="text-xl font-bold text-st-blue">{wallStrength}</span>
                </div>
                <input
                  type="range" min={1} max={6} step={1} value={wallStrength}
                  onChange={(e) => setWallStrength(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-st-black/45 mt-2">
                  <span>1 (Thin)</span><span>6 (Thick)</span>
                </div>
              </div>

              {/* Infill */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                <div className="flex justify-between items-baseline mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-st-black/70">Infill Density</label>
                  <span className="text-xl font-bold text-st-blue">{infill}%</span>
                </div>
                <input
                  type="range" min={0} max={100} step={5} value={infill}
                  onChange={(e) => setInfill(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-[10px] text-st-black/45 mt-2">
                  <span>0% (Hollow)</span><span>100% (Solid)</span>
                </div>
              </div>

              {/* Print quality */}
              <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6">
                <label className="block text-xs font-bold uppercase tracking-wider text-st-black/70 mb-3">
                  Print Quality
                </label>
                <input
                  type="range" min={0} max={3} step={1} value={quality}
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

          {/* ── Bottom CTA / Quote result ── */}
          <div className="shrink-0 bg-white rounded-2xl border border-slate-200 px-4 py-3 sm:px-5 sm:py-4">
            {quote && sliceStatus === 'done' && (
              <div className="mb-4 pb-4 border-b border-slate-100">
                <QuoteResult
                  quote={quote}
                  onReset={() => { setQuote(null); setSliceStatus('idle') }}
                />
              </div>
            )}

            <div className="flex flex-col items-center gap-2 sm:gap-2.5 lg:flex-row lg:justify-center lg:gap-6">
              {sliceStatus === 'slicing' && (
                <div className="w-full lg:hidden h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-st-blue rounded-full transition-all duration-300"
                    style={{ width: `${sliceProgress}%` }}
                  />
                </div>
              )}

              <button
                type="submit"
                disabled={!file || sliceStatus === 'slicing' || !pricing}
                className="st-btn st-btn-primary text-base px-10 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {sliceStatus === 'slicing' ? (
                  <span className="flex items-center gap-2.5">
                    <Spinner />
                    Slicing… {sliceProgress}%
                  </span>
                ) : quote && sliceStatus === 'done' ? (
                  'Update estimate'
                ) : (
                  'Get My Quote'
                )}
              </button>

              <div className="text-center lg:text-left lg:max-w-sm">
                {sliceStatus === 'error' && sliceError ? (
                  <p className="text-xs text-st-red font-semibold">{sliceError}</p>
                ) : (
                  <p className="text-xs sm:text-sm font-bold text-st-black/70">
                    {!file
                      ? 'Upload an STL or 3MF file to get started'
                      : sliceStatus === 'slicing'
                      ? 'Slicing your model with Cura Engine — this may take a minute…'
                      : quote && sliceStatus === 'done'
                      ? 'Changing material, quality, walls, or infill clears the figure above until you slice again — tap Update estimate to re-run with the same settings.'
                      : 'Tap Get My Quote to slice with your current settings and refresh the estimate.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
