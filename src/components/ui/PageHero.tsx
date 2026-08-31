import Image from "next/image";

type Props = {
  eyebrow?: string; title: string; subtitle?: string;
  showLogo?: boolean; children?: React.ReactNode;
};

const DOTS = [[8,25,"#FFD700"],[80,15,"#87CEEB"],[20,70,"#FF8C42"],[90,60,"#FFE966"],[50,10,"#87CEEB"],[65,80,"#FFD700"]];

export default function PageHero({ eyebrow, title, subtitle, showLogo=false, children }: Props) {
  return (
    <div className="py-20 text-center relative overflow-hidden"
      style={{background:"linear-gradient(135deg,#040D1A 0%,#071828 35%,#0A2A50 65%,#040D1A 100%)"}}>

      {/* Glows */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none"
        style={{background:"radial-gradient(circle,rgba(135,206,235,.2) 0%,transparent 70%)",transform:"translateY(-40%)"}}/>
      <div className="absolute bottom-0 right-1/4 w-72 h-72 rounded-full pointer-events-none"
        style={{background:"radial-gradient(circle,rgba(255,215,0,.18) 0%,transparent 70%)",transform:"translateY(40%)"}}/>

      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-[3px]"
        style={{background:"linear-gradient(90deg,transparent,#87CEEB,#FFD700,#FF8C42,#FFD700,#87CEEB,transparent)"}}/>

      {/* Sparkle dots */}
      {DOTS.map(([x,y,c],i)=>(
        <div key={i} className="sparkle absolute rounded-full pointer-events-none"
          style={{left:`${x}%`,top:`${y}%`,width:"7px",height:"7px",
            background:`radial-gradient(circle,${c} 0%,transparent 70%)`,
            boxShadow:`0 0 8px 3px ${c}70`, animationDelay:`${i*0.35}s`}}/>
      ))}

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        {showLogo && (
          <div className="flex justify-center mb-6">
            <div className="relative spin-ring">
              <div className="relative w-16 h-16 rounded-full overflow-hidden pulse-glow"
                style={{boxShadow:"0 0 0 4px #071828"}}>
                <Image src="/logo.png" alt="Smells From Heaven" fill className="object-cover" sizes="64px"/>
              </div>
            </div>
          </div>
        )}

        {eyebrow && (
          <p className="text-sm font-extrabold tracking-widest uppercase mb-3" style={{color:"#87CEEB"}}>
            ✦ {eyebrow} ✦
          </p>
        )}

        <h1 className="text-4xl sm:text-5xl font-bold font-[var(--font-playfair)] text-white mb-4">
          {title}
        </h1>

        {/* Tri-color divider */}
        <div className="flex items-center justify-center gap-1 mb-5">
          <div className="h-0.5 w-12 rounded-full" style={{background:"linear-gradient(90deg,transparent,#87CEEB)"}}/>
          <div className="w-2 h-2 rounded-full sparkle" style={{background:"#FFD700",boxShadow:"0 0 8px #FFD70099"}}/>
          <div className="h-0.5 w-8 rounded-full" style={{background:"#FFD700"}}/>
          <div className="w-2 h-2 rounded-full sparkle" style={{background:"#FF8C42",boxShadow:"0 0 8px #FF8C4299",animationDelay:".4s"}}/>
          <div className="h-0.5 w-12 rounded-full" style={{background:"linear-gradient(90deg,#87CEEB,transparent)"}}/>
        </div>

        {subtitle && (
          <p className="text-base sm:text-lg max-w-xl mx-auto leading-relaxed" style={{color:"rgba(184,228,249,.82)"}}>
            {subtitle}
          </p>
        )}
        {children && <div className="mt-6">{children}</div>}
      </div>

      {/* Bottom shimmer line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{background:"linear-gradient(90deg,transparent,#FF8C42,#FFD700,#87CEEB,#FFD700,#FF8C42,transparent)"}}/>
    </div>
  );
}
