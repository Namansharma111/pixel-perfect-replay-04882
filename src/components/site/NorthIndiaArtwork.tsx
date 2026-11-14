export function NorthIndiaArtwork({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 760 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Artistic panorama of Chandigarh Open Hand Monument, Punjab Golden Temple, and Himachal Pradesh Himalayas"
    >
      <defs>
        {/* Soft mountain shading */}
        <linearGradient id="himalayaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E293B" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0.02" />
        </linearGradient>

        <linearGradient id="goldAccent" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFD84A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#FF941E" stopOpacity="0.15" />
        </linearGradient>
      </defs>

      {/* --- BACKGROUND: HIMALAYAN PEAKS (HIMACHAL PRADESH) --- */}
      {/* Far snow peaks */}
      <path
        d="M20 230 L75 145 L130 195 L190 120 L250 185 L310 135 L370 230 Z"
        fill="url(#himalayaGrad)"
        stroke="#334155"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.5"
      />
      {/* Peak ridge lines */}
      <path
        d="M75 145 L85 225 M190 120 L180 220 M310 135 L320 225"
        stroke="#475569"
        strokeWidth="0.8"
        strokeDasharray="2 3"
        opacity="0.6"
      />

      {/* Mid mountain hills & pine trees */}
      <path
        d="M0 245 Q60 200 130 225 T260 215 T380 245 L380 260 L0 260 Z"
        fill="#0F172A"
        fillOpacity="0.03"
        stroke="#334155"
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Pine Trees silhouette cluster (Himachal) */}
      <g stroke="#1E293B" strokeWidth="1" strokeLinejoin="round" fill="none">
        {/* Tree 1 */}
        <path d="M42 245 L42 225 M36 240 L42 232 L48 240 M38 234 L42 227 L46 234 M40 228 L42 222 L44 228" />
        {/* Tree 2 */}
        <path d="M54 245 L54 220 M47 237 L54 228 L61 237 M49 230 L54 223 L59 230 M51 224 L54 218 L57 224" />
        {/* Tree 3 */}
        <path d="M66 245 L66 226 M61 240 L66 233 L71 240 M63 234 L66 228 L69 234" />
        {/* Tree 4 */}
        <path d="M80 245 L80 222 M74 238 L80 230 L86 238 M76 231 L80 224 L84 231" />
      </g>

      {/* Shimla Hill Ridge spire / church tower */}
      <g stroke="#0F172A" strokeWidth="1.2" strokeLinejoin="round" fill="none">
        <path d="M102 245 L102 205 L110 185 L118 205 L118 245 Z" />
        <line x1="110" y1="185" x2="110" y2="175" strokeWidth="1.5" />
        <line x1="107" y1="178" x2="113" y2="178" strokeWidth="1.2" />
        <rect x="106" y="212" width="8" height="12" rx="4" />
        <path d="M92 245 L92 220 L102 215 M118 215 L128 220 L128 245" />
      </g>

      {/* --- CENTER: GOLDEN TEMPLE / AMRITSAR ARCHITECTURE (PUNJAB) --- */}
      {/* Sacred Pool / Sarovar water level base */}
      <line x1="150" y1="245" x2="740" y2="245" stroke="#0F172A" strokeWidth="1.4" />
      <line x1="160" y1="250" x2="720" y2="250" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="6 4" />
      <line x1="200" y1="254" x2="520" y2="254" stroke="#CBD5E1" strokeWidth="0.6" strokeDasharray="4 6" />

      {/* Darshani Deori / Entrance Arch (Punjab) */}
      <g stroke="#0F172A" strokeWidth="1.2" strokeLinejoin="round" fill="none">
        <rect x="200" y="215" width="32" height="30" />
        <path d="M208 245 C208 230 224 230 224 245" strokeWidth="1.2" />
        <path d="M198 215 Q216 205 234 215" />
        <circle cx="216" cy="203" r="2.5" />
      </g>

      {/* Causeway bridge over water */}
      <line x1="232" y1="238" x2="265" y2="238" stroke="#0F172A" strokeWidth="1.5" />
      <line x1="240" y1="238" x2="240" y2="245" stroke="#0F172A" strokeWidth="1" />
      <line x1="255" y1="238" x2="255" y2="245" stroke="#0F172A" strokeWidth="1" />

      {/* Harmandir Sahib (Golden Temple) Main Sanctum */}
      <g stroke="#0F172A" strokeWidth="1.3" strokeLinejoin="round" fill="none">
        {/* Plinth */}
        <rect x="265" y="200" width="105" height="45" rx="1" fill="#FFFFFF" />
        {/* Subtle gold glow wash inside temple */}
        <rect x="268" y="202" width="99" height="41" fill="url(#goldAccent)" stroke="none" />

        {/* Lower marble floor arches */}
        <path d="M275 245 C275 232 287 232 287 245" />
        <path d="M293 245 C293 230 307 230 307 245" />
        <path d="M313 245 C313 230 327 230 327 245" />
        <path d="M333 245 C333 230 347 230 347 245" />

        {/* Upper floor balcony / Jharokhas */}
        <line x1="262" y1="216" x2="373" y2="216" strokeWidth="1.5" />
        <rect x="276" y="205" width="14" height="11" rx="2" />
        <rect x="296" y="204" width="16" height="12" rx="2" />
        <rect x="318" y="204" width="16" height="12" rx="2" />
        <rect x="340" y="205" width="14" height="11" rx="2" />

        {/* Cornice / Roofline */}
        <line x1="260" y1="200" x2="375" y2="200" strokeWidth="2" />

        {/* Corner Chhatris (Domes on pillars) */}
        {/* Left chhatri */}
        <path d="M266 200 L266 188 M274 200 L274 188" />
        <path d="M263 188 Q270 178 277 188 Z" fill="#FEF08A" strokeWidth="1" />
        <line x1="270" y1="178" x2="270" y2="173" strokeWidth="1.2" />

        {/* Right chhatri */}
        <path d="M361 200 L361 188 M369 200 L369 188" />
        <path d="M358 188 Q365 178 372 188 Z" fill="#FEF08A" strokeWidth="1" />
        <line x1="365" y1="178" x2="365" y2="173" strokeWidth="1.2" />

        {/* Grand Golden Fluted Dome */}
        <path
          d="M294 200 Q294 175 317 165 Q340 175 340 200 Z"
          fill="#FEF08A"
          fillOpacity="0.4"
          stroke="#0F172A"
          strokeWidth="1.5"
        />
        {/* Dome flutes */}
        <path d="M303 198 Q308 178 317 165 Q326 178 331 198" stroke="#D97706" strokeWidth="0.8" />
        <line x1="317" y1="198" x2="317" y2="165" stroke="#D97706" strokeWidth="0.8" />

        {/* Kalash & Lotus Finial */}
        <path d="M314 165 C314 160 320 160 320 165" strokeWidth="1.2" />
        <line x1="317" y1="160" x2="317" y2="150" strokeWidth="1.8" />
        <circle cx="317" cy="148" r="2" fill="#F59E0B" />
      </g>

      {/* --- RIGHT: CHANDIGARH ARCHITECTURE & OPEN HAND MONUMENT --- */}
      {/* Modern Capitol Complex / Secretariat Building (Chandigarh) */}
      <g stroke="#0F172A" strokeWidth="1.2" strokeLinejoin="round" fill="none">
        {/* Secretariat blocks with Le Corbusier grid of sun-breakers */}
        <rect x="400" y="165" width="85" height="80" rx="1" fill="#F8FAFC" />
        {/* Modular Grid Pattern */}
        <line x1="400" y1="180" x2="485" y2="180" strokeWidth="0.8" stroke="#64748B" />
        <line x1="400" y1="195" x2="485" y2="195" strokeWidth="0.8" stroke="#64748B" />
        <line x1="400" y1="210" x2="485" y2="210" strokeWidth="0.8" stroke="#64748B" />
        <line x1="400" y1="225" x2="485" y2="225" strokeWidth="0.8" stroke="#64748B" />

        <line x1="417" y1="165" x2="417" y2="245" strokeWidth="0.8" stroke="#64748B" />
        <line x1="434" y1="165" x2="434" y2="245" strokeWidth="0.8" stroke="#64748B" />
        <line x1="451" y1="165" x2="451" y2="245" strokeWidth="0.8" stroke="#64748B" />
        <line x1="468" y1="165" x2="468" y2="245" strokeWidth="0.8" stroke="#64748B" />

        {/* Roof canopy / sculptural elements */}
        <path d="M410 165 C410 152 445 152 445 165" strokeWidth="1.4" />
        <rect x="455" y="154" width="20" height="11" strokeWidth="1.2" />

        {/* Palace of Assembly Hypostyle & Pyramid Roof */}
        <rect x="495" y="185" width="75" height="60" rx="1" fill="#FFFFFF" />
        {/* Assembly portico curve */}
        <path d="M490 200 Q532 188 575 200" strokeWidth="2" />
        <line x1="505" y1="200" x2="505" y2="245" strokeWidth="1.5" />
        <line x1="520" y1="200" x2="520" y2="245" strokeWidth="1.5" />
        <line x1="535" y1="200" x2="535" y2="245" strokeWidth="1.5" />
        <line x1="550" y1="200" x2="550" y2="245" strokeWidth="1.5" />
        <line x1="565" y1="200" x2="565" y2="245" strokeWidth="1.5" />

        {/* Hyperbolic Assembly Tower */}
        <path
          d="M518 185 C522 155 528 140 545 136 C548 155 546 170 546 185"
          strokeWidth="1.4"
          fill="#F1F5F9"
        />
        <ellipse cx="533" cy="136" rx="13" ry="4" strokeWidth="1.2" />
      </g>

      {/* THE ICONIC CHANDIGARH OPEN HAND MONUMENT */}
      <g stroke="#0F172A" strokeLinejoin="round" fill="none">
        {/* Pedestal shaft */}
        <path d="M635 245 L635 170 L647 170 L647 245" strokeWidth="1.5" fill="#E2E8F0" />
        {/* Trench / Pit of Contemplation concrete ramp */}
        <path d="M605 245 L635 210 M647 210 L675 245" strokeWidth="1.2" />

        {/* Pivot disc */}
        <circle cx="641" cy="165" r="7" strokeWidth="1.5" fill="#FEF08A" />

        {/* The Open Hand silhouette (Monument de la Main Ouverte) */}
        <path
          d="M641 160 
             C632 155 623 148 620 138 
             C618 128 624 122 630 126 
             C634 129 638 134 640 138 
             C640 125 640 110 644 102 
             C647 95 653 96 654 105 
             C655 114 654 125 654 135 
             C658 124 663 115 667 112 
             C672 108 676 113 674 121 
             C671 130 666 138 662 145 
             C669 140 677 135 683 136 
             C688 138 688 146 682 152 
             C674 161 660 167 649 168 Z"
          strokeWidth="2.2"
          fill="#FEF08A"
          fillOpacity="0.85"
        />
        {/* Hand contour lines */}
        <path d="M644 140 C646 150 650 156 655 160" stroke="#D97706" strokeWidth="1" />
        <path d="M654 135 C656 145 658 152 660 158" stroke="#D97706" strokeWidth="1" />
      </g>

      {/* Sukhna Lake promenade tree & flying birds */}
      <g stroke="#0F172A" strokeWidth="1" fill="none">
        <path d="M700 245 Q705 220 710 205 Q715 220 720 245" />
        <path d="M695 215 Q710 195 725 215" />
        <path d="M700 205 Q710 190 720 205" />

        {/* Birds flying above lake */}
        <path d="M570 110 Q575 104 580 110 Q585 104 590 110" strokeWidth="1.2" />
        <path d="M595 118 Q600 113 605 118 Q610 113 615 118" strokeWidth="1" />
        <path d="M560 125 Q564 120 568 125 Q572 120 576 125" strokeWidth="0.9" />
      </g>

      {/* --- ELEGANT CALLIGRAPHIC SIGNATURE / TEXT (MATCHING IMAGE 1) --- */}
      <g textAnchor="middle">
        {/* Large flowing handwritten script */}
        <text
          x="380"
          y="318"
          fill="#0F172A"
          fontFamily="ui-serif, Georgia, Cambria, 'Times New Roman', Times, serif"
          fontStyle="italic"
          fontWeight="600"
          fontSize="44"
          letterSpacing="1"
        >
          North India
        </text>

        {/* Clean supporting badge text */}
        <text
          x="380"
          y="348"
          fill="#64748B"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="700"
          fontSize="11.5"
          letterSpacing="4"
        >
          CHANDIGARH • PUNJAB • HIMACHAL
        </text>
      </g>
    </svg>
  );
}
