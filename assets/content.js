/* ------------------------------------------------------------------
   All portfolio text lives here. Edit freely — the page rebuilds itself.
   Images: name only (no extension) from assets/img/. Videos: assets/video/.
   fit: 'contain' shows the whole cover image (good for wide CAD renders);
   bg: '#hex' sets the colour behind a 'contain' cover.
------------------------------------------------------------------- */

window.PROJECTS = [
  {
    id: 'robot',
    title: 'Self-Balancing Robot',
    meta: 'Personal project · 2025',
    tags: ['Mechatronics', 'PCB design', 'Fusion 360', '3D printing'],
    cover: 'sbr-cad-iso',
    summary:
      'A two-wheeled robot I designed, 3D printed, wired and programmed from scratch, including my first custom PCB.',
    points: [
      'Designed a two-layer PCB in KiCad around an ESP32, two A4988 stepper drivers and a 5 V regulator, with trace widths sized for the 15 V, 5 V and signal rails.',
      'Built the full Fusion 360 assembly with threaded inserts and 0.2 mm print tolerances, then printed and assembled it.',
      'Hand-assembled the board (my first SMD soldering) and fault-found a shorted regulator and lifted pad during testing.',
    ],
    gallery: [
      { img: 'sbr-skeleton', cap: 'Internal skeleton: two NEMA 17 steppers, PCB, round LCD and a 4S Li-ion pack with BMS.' },
      { img: 'sbr-schematic', cap: 'KiCad schematic: ESP32, stepper drivers, regulator and IMU.' },
      { img: 'sbr-pcb-top', cap: 'Two-layer layout with a stitched ground plane.' },
      { img: 'sbr-pcb-render', cap: 'PCB render used to check fit and mounting holes in the CAD assembly.' },
      { img: 'sbr-pcb-assembly', cap: 'SMD parts soldered with paste and a heat gun, then through-hole headers.' },
      { img: 'sbr-print-fit', cap: 'First printed fit-check. One motor mount was re-toleranced and reprinted.' },
      { img: 'sbr-pcb-mounted', cap: 'Repaired a shorted 5 V regulator and stripped pad with a jumper wire.' },
      { img: 'sbr-assembly', cap: 'Full assembly with 45 W USB-C PD charging, so it charges without being opened.' },
    ],
  },
  {
    id: 'grove',
    title: 'Grove Design',
    meta: 'Junior Design Engineer · 2024–present',
    tags: ['SolidWorks', 'Prototyping', 'Mechanism design', 'Testing'],
    cover: 'grove-parallel-arm',
    fit: 'contain',
    summary:
      'Year in industry, then a return as Junior Design Engineer at a multidisciplinary design consultancy. Most work is under NDA, so these examples are kept generic.',
    points: [
      'Tested and iterated a sprung four-bar parallel arm, calculating target spring forces and refining spring placement so it held consistent, safe pressure, all to a tight deadline and budget.',
      'Diagnosed head wobble and missing preload on an automotive metrology rig, then co-developed a stiffer linear guide redesign. The rebuilt rig gave consistent, usable measurements.',
      'Rapid prototyping with SolidWorks, Bambu Lab FDM and Formlabs resin printers, from proof-of-concept parts to client-ready prototypes.',
    ],
    gallery: [
      { img: 'grove-parallel-arm', cap: 'Sprung parallel arm: first and final iterations.' },
      { img: 'grove-metrology', cap: 'Redesigned calibration plate sub-assembly and engineering drawing.' },
      { img: 'grove-printing', cap: 'FDM and resin printed prototype parts.' },
    ],
  },
  {
    id: 'ragbot',
    title: 'RagBot',
    meta: 'University of Bristol · Team of 5 · 2024',
    tags: ['Robotics', 'Linkage design', 'Arduino', 'Agri-tech'],
    cover: 'ragbot-render',
    summary:
      'An agricultural robot that detects and removes ragwort, a plant that is poisonous to livestock. I co-designed and built the lifting linkage arm.',
    points: [
      'Rejected an early linkage after Fusion 360 motion studies showed a singularity around 90°, then chose a four-bar linkage for controlled rotation and prying leverage.',
      'Sized the geared DC motors from torque and position analysis of the full movement cycle (Maple).',
      'Built the prototype arm, driven by an Arduino Mega, on a rocker-bogie chassis with a two-camera vision system.',
    ],
    gallery: [
      { video: 'ragbot-final-test', poster: 'ragbot-final-test-poster', cap: 'Final prototype test run.' },
      { img: 'ragbot-prototype', cap: 'Prototype assembly with the four-bar arm.' },
      { img: 'ragbot-linkage-cad', cap: 'Section view of the final linkage: bearing housings, shafts and motor mounts.' },
      { img: 'ragbot-torque', cap: 'Torque required through the movement cycle.' },
      { img: 'ragbot-position', cap: 'Arm positions through the movement cycle.' },
      { video: 'ragbot-linkage-test', poster: 'ragbot-linkage-test-poster', cap: 'Early linkage motion study, rejected because of a singularity.' },
    ],
  },
  {
    id: 'logger',
    title: 'Mine-Waste Temperature Logger',
    meta: 'Geochemic · 2023',
    tags: ['Raspberry Pi', 'Python', 'Sensors', 'Environmental'],
    cover: 'pi-lcd-box',
    summary:
      'A weatherproof data logger for a rainfall and UV experiment on mine waste, recording surface temperature from eight sensors.',
    points: [
      'Wrote Python on a Raspberry Pi to log eight PT100 sensors every 10 minutes into weekly spreadsheets.',
      'Added an LCD so lab technicians could check live readings at a glance.',
      'Designed and 3D printed a protective mount inside a waterproof enclosure.',
    ],
    gallery: [
      { img: 'pi-setup', cap: 'Raspberry Pi 3B with an RTD data-acquisition HAT and eight PT100 sensors.' },
      { img: 'pi-enclosure-render', cap: 'Enclosure concept.' },
      { img: 'pi-case', cap: '3D printed case for moisture protection and secure mounting.' },
      { img: 'pi-sensors', cap: 'Sensors embedded 5 mm into the mine-waste surface.' },
      { img: 'pi-rain-rig', cap: 'Rain and UV simulation rig replicating Swedish conditions.' },
    ],
  },
  {
    id: 'textiles',
    title: 'Textile Recycling Decision System',
    meta: 'Dissertation · 2026 · First',
    tags: ['Sustainability', 'Decision logic', 'Statistics'],
    summary:
      'Developed a logic-based decision system for sorting textiles for recycling, and used hypothesis testing to benchmark human sorting accuracy against automated technologies to show where each falls short.',
    points: [],
    gallery: [],
  },
  {
    id: 'speaker',
    title: 'Studio Speaker',
    meta: 'Personal project · 2023',
    tags: ['Electronics', 'Woodwork', 'Acoustics'],
    cover: 'speaker-garden',
    summary:
      'A ported two-way desk speaker with a hand-soldered crossover and a plywood cabinet, taken from sketches to CAD to a finished build.',
    points: [],
    gallery: [
      { img: 'speaker-sketches', cap: 'Concept sketches for the cabinet and internal layout.' },
      { video: 'speaker-cad', poster: 'speaker-cad-poster', cap: 'CAD animation of the internal components.' },
      { img: 'speaker-crossover', cap: 'Hand-soldered crossover splitting high and low frequencies.' },
      { img: 'speaker-internals', cap: 'Drivers, port tube and damping to reduce cabinet vibration.' },
      { img: 'speaker-back', cap: 'Rear: port and banana-plug terminals.' },
    ],
  },
  {
    id: 'solar-fan',
    title: 'Solar-Powered Ceiling Fan',
    meta: 'A-level Product Design · 2021',
    tags: ['Renewables', 'Product design', 'CAD'],
    cover: 'fan-cad',
    fit: 'contain',
    bg: '#939393',
    summary:
      'A low-cost, off-grid cooling concept for hot regions and temporary field hospitals, with 3D-printed blades that lock into the hub like a jigsaw.',
    points: [],
    gallery: [
      { img: 'fan-cad', cap: 'Final CAD with battery and solar panel.' },
      { img: 'fan-sketches', cap: 'Final design and manufacturing sketches.' },
      { img: 'fan-blade-concepts', cap: 'Blade and hub concepts.' },
    ],
  },
];

/* "From the sketchbook" section */
window.SKETCHES = [
  { img: 'sketch-mouse', title: 'Mouse concept', cap: 'Form sketches for an ergonomic computer mouse.' },
  { img: 'speaker-sketches', title: 'Speaker', cap: 'Cabinet shapes and internal layout.' },
  { img: 'fan-sketches', title: 'Solar fan', cap: 'Final design and manufacturing notes.' },
  { img: 'fan-blade-concepts', title: 'Fan blades', cap: 'Blade and hub concepts.' },
];

/* Furniture & making: reused and local materials */
window.MAKING = [
  { img: 'make-desk', title: 'Pommel Horse Desk', cap: 'Oak reclaimed from a neglected vintage pommel horse, keeping its handle holds.' },
  { img: 'make-pallet-bed', title: 'Pallet Bed', cap: 'Pallets reused from a local delivery business.' },
  { img: 'make-sofa-bed', title: 'Sofa Bed', cap: 'Scorched-pine futon with a pull-out frame.' },
  { img: 'make-tv-stand', title: 'TV Stand', cap: 'Formed flexi-ply with a slate top from a local mine.' },
  { img: 'make-rail', title: 'Clothing Rail', cap: 'Bent and soldered copper pipe with a hand-carved branch.' },
  { img: 'make-bedside-oak', title: 'Bedside Tables', cap: 'Tiled cinder blocks, first topped with polished concrete, now remade into two bedside tables with tops cut from an old oak bench plank.' },
  { img: 'make-bowl', title: 'Ceramic Bowl', cap: 'Clay pressed into a textured wooden mould, glazed and fired.' },
  { img: 'make-lamp', title: 'Hand Lamp', cap: 'An existing CAD model, adapted and 3D printed.' },
];
