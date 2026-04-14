import { useState } from 'react'

function App() {
  const [originalImage, setOriginalImage] = useState(null)
  const [cleanedImage, setCleanedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return
    setOriginalImage(URL.createObjectURL(file))
    setCleanedImage(null)
    setIsLoading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:8000/process", {
        method: "POST",
        body: formData,
      })

      if (response.ok) {
        const blob = await response.blob()
        setCleanedImage(URL.createObjectURL(blob))
      } else {
        alert("Backend error. Make sure your Python server is running on Port 8000!")
      }
    } catch (error) {
      alert("Connection failed! Check your VS Code terminal for Backend errors.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Dynamic Background Blobs */}
      <div className="fixed inset-0 overflow-hidden -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="max-w-7xl mx-auto py-16 px-6">
        {/* Header Section */}
        <header className="text-center mb-16">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-bold tracking-widest text-cyan-400 uppercase bg-cyan-400/10 border border-cyan-400/20 rounded-full">
            Engineering Project: RPCA Implementation
          </div>
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
            Deweathering Engine
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed font-light italic">
            "Separating <span className="text-cyan-400">Sparse Text</span> from <span className="text-purple-400">Low-Rank Noise</span>"
          </p>
        </header>

        {/* Modern Upload Zone */}
        <div className="max-w-2xl mx-auto mb-20">
          <label className="relative group block p-1 rounded-3xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:scale-[1.01] transition-all cursor-pointer shadow-[0_0_50px_rgba(6,182,212,0.15)]">
            <div className="bg-[#1e293b] rounded-[22px] py-14 px-6 flex flex-col items-center border border-white/5 group-hover:bg-[#1e293b]/80 transition-all">
              <div className="w-16 h-16 mb-4 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                </svg>
              </div>
              <p className="text-lg font-medium text-slate-200">Click to upload document scan</p>
              <p className="text-xs text-slate-500 mt-2 tracking-widest uppercase">FastAPI + React Processing</p>
            </div>
            <input type="file" className="hidden" onChange={handleImageUpload} />
          </label>
        </div>

        {/* Split Comparison Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Input Card */}
          {originalImage && (
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
               <div className="absolute top-4 right-6 text-[40px] font-black text-white/5 select-none tracking-tighter">INPUT</div>
              <h3 className="text-cyan-400 font-bold uppercase tracking-[0.2em] text-sm mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee]"></span> Weathered Matrix (D)
              </h3>
              <div className="bg-black/20 rounded-2xl p-4 border border-white/5 h-[650px] flex items-center justify-center overflow-hidden shadow-inner">
                <img src={originalImage} className="max-h-full max-w-full object-contain rounded shadow-2xl" alt="Input" />
              </div>
            </div>
          )}

          {/* Output Card */}
          {(isLoading || cleanedImage) && (
            <div className="bg-gradient-to-b from-white/10 to-transparent backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-4 right-6 text-[40px] font-black text-white/5 select-none tracking-tighter">OUTPUT</div>
              <h3 className="text-purple-400 font-bold uppercase tracking-[0.2em] text-sm mb-6 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#a855f7]"></span> Sparse Matrix (E)
              </h3>
              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 h-[650px] flex items-center justify-center overflow-hidden relative shadow-inner">
                {isLoading ? (
                  <div className="flex flex-col items-center">
                    <div className="w-14 h-14 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mb-6"></div>
                    <p className="text-cyan-400 font-mono text-xs animate-pulse tracking-[0.4em]">Optimizing SVD...</p>
                  </div>
                ) : (
                  <img 
                    src={cleanedImage} 
                    className="max-h-full max-w-full object-contain rounded shadow-2xl bg-white p-2" 
                    alt="Restored Result" 
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App