(function () {
  const categories = [
    {
      slug: "engine-parts",
      name: "Engine Parts",
      vehicleTypes: ["CAR", "HEAVY TRUCK"],
      image: "/assets/categories/engine-parts.svg",
      intro:
        "Engine service and replacement parts organized by vehicle application, OEM reference and engine model."
    },
    {
      slug: "brake-system",
      name: "Brake System",
      vehicleTypes: ["CAR", "HEAVY TRUCK"],
      image: "/assets/categories/brake-system.svg",
      intro:
        "Brake components for passenger cars and heavy vehicles, structured around part number, position and vehicle fitment."
    },
    {
      slug: "suspension",
      name: "Suspension",
      vehicleTypes: ["CAR", "HEAVY TRUCK"],
      image: "/assets/categories/suspension.svg",
      intro:
        "Suspension parts for ride control, chassis support and heavy-duty road use."
    },
    {
      slug: "steering",
      name: "Steering",
      vehicleTypes: ["CAR", "HEAVY TRUCK"],
      image: "/assets/categories/steering.svg",
      intro:
        "Steering components organized for clear application matching and direct enquiry."
    },
    {
      slug: "electrical",
      name: "Electrical",
      vehicleTypes: ["CAR", "HEAVY TRUCK"],
      image: "/assets/categories/electrical.svg",
      intro:
        "Electrical and control parts prepared for model, engine and OEM-number lookup."
    },
    {
      slug: "cooling",
      name: "Cooling",
      vehicleTypes: ["CAR", "HEAVY TRUCK"],
      image: "/assets/categories/cooling-system.svg",
      intro:
        "Cooling-system parts for engine temperature control and vehicle-specific replacement."
    },
    {
      slug: "transmission",
      name: "Transmission",
      vehicleTypes: ["CAR", "HEAVY TRUCK"],
      image: "/assets/categories/clutch-transmission.svg",
      intro:
        "Transmission service and drive-system parts presented with structured fitment information."
    },
    {
      slug: "body-parts",
      name: "Body Parts",
      vehicleTypes: ["CAR", "HEAVY TRUCK"],
      image: "/assets/categories/body-others.svg",
      intro:
        "Body, trim and mounting parts kept simple for part-number and photo-based enquiries."
    },
    {
      slug: "clutch",
      name: "Clutch",
      vehicleTypes: ["HEAVY TRUCK"],
      image: "/assets/categories/clutch-transmission.svg",
      intro:
        "Heavy-duty clutch assemblies and service parts for commercial vehicle applications."
    },
    {
      slug: "differential",
      name: "Differential",
      vehicleTypes: ["HEAVY TRUCK"],
      image: "/assets/products/clutch-assembly.svg",
      intro:
        "Differential and rear axle parts for heavy-duty drivetrain service."
    }
  ];

  const products = [
    {
      id: "demo-car-oil-filter-module",
      slug: "engine-oil-filter-module",
      sku: "AX-CAR-OFM-2408",
      name: "Engine Oil Filter Module",
      vehicleType: "CAR",
      category: "engine-parts",
      subcategory: "Filtration",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-CAR-OFM-2408",
      oemNumbers: ["04152-YZZA1", "90915-YZZE1"],
      vehicleBrand: "Toyota",
      vehicleBrands: ["Toyota"],
      vehicleModels: ["Vios"],
      engineModels: ["2NR-FE", "1NZ-FE"],
      yearFrom: 2014,
      yearTo: 2023,
      shortDescription:
        "Replacement oil filter module prepared for passenger vehicle engine service and direct enquiry.",
      description:
        "A structured passenger-car engine service product with clear OEM references, vehicle application and engine-code data for sourcing workflows.",
      features: [
        "Clear OEM and AXRIVO part number reference",
        "Prepared for Toyota Vios engine service applications",
        "Gallery-ready image structure for future product photography",
        "Designed for enquiry-led sourcing"
      ],
      weight: "0.42 kg",
      dimensions: "92 x 74 x 74 mm",
      material: "Filter media, steel shell, rubber seal",
      position: "Engine lubrication system",
      mainImage: "/assets/products/oil-filter-module.svg",
      images: [
        "/assets/products/oil-filter-module.svg",
        "/assets/categories/engine-parts.svg",
        "/assets/products/radiator-core.svg"
      ],
      imageAlt: "AXRIVO engine oil filter module placeholder",
      compatibility: [
        { vehicleBrand: "Toyota", vehicleModel: "Vios", year: "2019-2023", engine: "1.5L", engineModel: "2NR-FE" },
        { vehicleBrand: "Toyota", vehicleModel: "Vios", year: "2014-2018", engine: "1.5L", engineModel: "1NZ-FE" }
      ],
      keywords: ["Toyota Vios", "1NZ", "2NR", "oil filter", "engine filter", "04152"],
      featured: true,
      newArrival: false,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-car-brake-rotor-set", "demo-car-shock-absorber-kit", "demo-car-radiator-core"]
    },
    {
      id: "demo-car-brake-rotor-set",
      slug: "ventilated-brake-rotor-set",
      sku: "AX-CAR-BRK-6610",
      name: "Ventilated Brake Rotor Set",
      vehicleType: "CAR",
      category: "brake-system",
      subcategory: "Disc Brake",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-CAR-BRK-6610",
      oemNumbers: ["43512-0K120", "45251-S9A-000"],
      vehicleBrand: "Toyota",
      vehicleBrands: ["Toyota", "Honda"],
      vehicleModels: ["Corolla", "Civic"],
      engineModels: ["1ZR-FE", "R18A"],
      yearFrom: 2016,
      yearTo: 2022,
      shortDescription: "Front brake rotor set for passenger vehicle brake system replacement.",
      description:
        "A passenger-car brake component example using clear category, OEM and vehicle compatibility fields.",
      features: ["Vehicle-specific brake fitment", "Front axle service position", "OEM-number lookup ready"],
      weight: "7.2 kg",
      dimensions: "275 x 275 x 48 mm",
      material: "Cast iron",
      position: "Front axle",
      mainImage: "/assets/products/brake-rotor-set.svg",
      images: ["/assets/products/brake-rotor-set.svg", "/assets/categories/brake-system.svg"],
      imageAlt: "Ventilated brake rotor set placeholder",
      compatibility: [
        { vehicleBrand: "Toyota", vehicleModel: "Corolla", year: "2016-2022", engine: "1.8L", engineModel: "1ZR-FE" },
        { vehicleBrand: "Honda", vehicleModel: "Civic", year: "2017-2021", engine: "1.8L", engineModel: "R18A" }
      ],
      keywords: ["brake rotor", "brake disc", "front brake", "43512"],
      featured: true,
      newArrival: true,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-car-rear-brake-drum", "demo-car-oil-filter-module"]
    },
    {
      id: "demo-car-rear-brake-drum",
      slug: "rear-brake-drum-assembly",
      sku: "AX-CAR-BDM-2740",
      name: "Rear Brake Drum Assembly",
      vehicleType: "CAR",
      category: "brake-system",
      subcategory: "Drum Brake",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-CAR-BDM-2740",
      oemNumbers: ["42431-0K120", "42610-BZ010"],
      vehicleBrand: "Perodua",
      vehicleBrands: ["Perodua", "Toyota"],
      vehicleModels: ["Myvi", "Avanza"],
      engineModels: ["1NR-VE", "K3-VE"],
      yearFrom: 2015,
      yearTo: 2022,
      shortDescription: "Rear brake drum replacement for compact passenger vehicles.",
      description:
        "A compact-vehicle brake drum product example prepared for part-number, category and vehicle search.",
      features: ["Brake drum keyword ready", "Rear axle position", "Passenger vehicle application"],
      weight: "3.9 kg",
      dimensions: "228 x 228 x 82 mm",
      material: "Cast iron",
      position: "Rear axle",
      mainImage: "/assets/categories/brake-system.svg",
      images: ["/assets/categories/brake-system.svg", "/assets/products/brake-rotor-set.svg"],
      imageAlt: "Rear brake drum assembly placeholder",
      compatibility: [
        { vehicleBrand: "Perodua", vehicleModel: "Myvi", year: "2018-2022", engine: "1.5L", engineModel: "1NR-VE" },
        { vehicleBrand: "Toyota", vehicleModel: "Avanza", year: "2015-2021", engine: "1.5L", engineModel: "K3-VE" }
      ],
      keywords: ["brake drum", "rear brake", "drum assembly", "42431"],
      featured: false,
      newArrival: true,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-car-brake-rotor-set"]
    },
    {
      id: "demo-car-shock-absorber-kit",
      slug: "stabilized-shock-absorber-kit",
      sku: "AX-CAR-SHK-3118",
      name: "Stabilized Shock Absorber Kit",
      vehicleType: "CAR",
      category: "suspension",
      subcategory: "Damper",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-CAR-SHK-3118",
      oemNumbers: ["48510-8Z025", "54650-4M400"],
      vehicleBrand: "Nissan",
      vehicleBrands: ["Nissan"],
      vehicleModels: ["Almera"],
      engineModels: ["HR15DE"],
      yearFrom: 2013,
      yearTo: 2020,
      shortDescription: "Suspension damper kit for passenger vehicle ride control.",
      description: "A passenger suspension example for clear model, year and engine filtering.",
      features: ["Ride-control application", "Front suspension service", "Model-specific data"],
      weight: "4.8 kg",
      dimensions: "620 x 150 x 150 mm",
      material: "Steel, hydraulic fluid",
      position: "Front suspension",
      mainImage: "/assets/products/shock-absorber-kit.svg",
      images: ["/assets/products/shock-absorber-kit.svg", "/assets/categories/suspension.svg"],
      imageAlt: "Shock absorber kit placeholder",
      compatibility: [
        { vehicleBrand: "Nissan", vehicleModel: "Almera", year: "2013-2020", engine: "1.5L", engineModel: "HR15DE" }
      ],
      keywords: ["shock absorber", "suspension", "damper", "Almera"],
      featured: true,
      newArrival: false,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-car-steering-rack-kit", "demo-car-brake-rotor-set"]
    },
    {
      id: "demo-car-radiator-core",
      slug: "cooling-radiator-core",
      sku: "AX-CAR-RAD-7022",
      name: "Cooling Radiator Core",
      vehicleType: "CAR",
      category: "cooling",
      subcategory: "Radiator",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-CAR-RAD-7022",
      oemNumbers: ["16400-0M060", "19010-RNA-A51"],
      vehicleBrand: "Honda",
      vehicleBrands: ["Honda"],
      vehicleModels: ["Civic"],
      engineModels: ["R18A"],
      yearFrom: 2012,
      yearTo: 2018,
      shortDescription: "Radiator core for passenger vehicle cooling-system replacement.",
      description: "A cooling-system example prepared for vehicle, engine and OEM lookup.",
      features: ["Cooling-system category data", "Engine temperature support", "OEM reference ready"],
      weight: "3.6 kg",
      dimensions: "650 x 420 x 36 mm",
      material: "Aluminum core, plastic tank",
      position: "Front cooling module",
      mainImage: "/assets/products/radiator-core.svg",
      images: ["/assets/products/radiator-core.svg", "/assets/categories/cooling-system.svg"],
      imageAlt: "Cooling radiator core placeholder",
      compatibility: [
        { vehicleBrand: "Honda", vehicleModel: "Civic", year: "2012-2018", engine: "1.8L", engineModel: "R18A" }
      ],
      keywords: ["radiator", "cooling", "Honda Civic", "R18A"],
      featured: true,
      newArrival: true,
      popular: false,
      status: "demo",
      relatedProducts: ["demo-car-oil-filter-module"]
    },
    {
      id: "demo-car-transmission-service-assembly",
      slug: "transmission-service-assembly",
      sku: "AX-CAR-TRN-8144",
      name: "Transmission Service Assembly",
      vehicleType: "CAR",
      category: "transmission",
      subcategory: "Service Kit",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-CAR-TRN-8144",
      oemNumbers: ["31210-0D090"],
      vehicleBrand: "Mitsubishi",
      vehicleBrands: ["Mitsubishi"],
      vehicleModels: ["Lancer"],
      engineModels: ["4A91"],
      yearFrom: 2014,
      yearTo: 2019,
      shortDescription: "Transmission service assembly for passenger vehicle drivetrain repair.",
      description: "A demo transmission product with structured drivetrain and application fields.",
      features: ["Transmission category ready", "Application notes supported", "Part-number search ready"],
      weight: "2.4 kg",
      dimensions: "280 x 240 x 72 mm",
      material: "Friction material, steel",
      position: "Transmission assembly",
      mainImage: "/assets/products/clutch-assembly.svg",
      images: ["/assets/products/clutch-assembly.svg", "/assets/categories/clutch-transmission.svg"],
      imageAlt: "Transmission service assembly placeholder",
      compatibility: [
        { vehicleBrand: "Mitsubishi", vehicleModel: "Lancer", year: "2014-2019", engine: "1.6L", engineModel: "4A91" }
      ],
      keywords: ["transmission", "Mitsubishi", "Lancer", "4A91"],
      featured: false,
      newArrival: true,
      popular: false,
      status: "demo",
      relatedProducts: ["demo-car-oil-filter-module"]
    },
    {
      id: "demo-car-steering-rack-kit",
      slug: "steering-rack-support-kit",
      sku: "AX-CAR-STR-4058",
      name: "Steering Rack Support Kit",
      vehicleType: "CAR",
      category: "steering",
      subcategory: "Rack Support",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-CAR-STR-4058",
      oemNumbers: ["45510-02090"],
      vehicleBrand: "Mazda",
      vehicleBrands: ["Mazda"],
      vehicleModels: ["Mazda 3"],
      engineModels: ["PE-VPS"],
      yearFrom: 2014,
      yearTo: 2018,
      shortDescription: "Steering support kit for passenger vehicle steering service.",
      description: "A steering-system product example for brand, model and part-number lookup.",
      features: ["Steering system category", "Clear fitment data", "Direct enquiry workflow"],
      weight: "1.6 kg",
      dimensions: "240 x 110 x 80 mm",
      material: "Steel, rubber bushing",
      position: "Steering rack",
      mainImage: "/assets/categories/steering.svg",
      images: ["/assets/categories/steering.svg", "/assets/products/shock-absorber-kit.svg"],
      imageAlt: "Steering rack support kit placeholder",
      compatibility: [
        { vehicleBrand: "Mazda", vehicleModel: "Mazda 3", year: "2014-2018", engine: "2.0L", engineModel: "PE-VPS" }
      ],
      keywords: ["steering rack", "Mazda 3", "PE-VPS"],
      featured: false,
      newArrival: false,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-car-shock-absorber-kit"]
    },
    {
      id: "demo-car-body-mounting-hardware",
      slug: "body-mounting-hardware-set",
      sku: "AX-CAR-BDY-7330",
      name: "Body Mounting Hardware Set",
      vehicleType: "CAR",
      category: "body-parts",
      subcategory: "Mounting",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-CAR-BDY-7330",
      oemNumbers: ["90119-08C45"],
      vehicleBrand: "Proton",
      vehicleBrands: ["Proton"],
      vehicleModels: ["Saga"],
      engineModels: ["S4PE"],
      yearFrom: 2016,
      yearTo: 2023,
      shortDescription: "Body mounting hardware for panel and trim replacement enquiries.",
      description: "A body-parts example designed for photo or part-number based enquiries.",
      features: ["Body category data", "Photo enquiry ready", "Basic application structure"],
      weight: "0.8 kg",
      dimensions: "180 x 120 x 45 mm",
      material: "Steel hardware, nylon clips",
      position: "Body panel mounting",
      mainImage: "/assets/categories/body-others.svg",
      images: ["/assets/categories/body-others.svg"],
      imageAlt: "Body mounting hardware placeholder",
      compatibility: [
        { vehicleBrand: "Proton", vehicleModel: "Saga", year: "2016-2023", engine: "1.3L", engineModel: "S4PE" }
      ],
      keywords: ["body parts", "Proton Saga", "clips", "mounting"],
      featured: false,
      newArrival: false,
      popular: false,
      status: "demo",
      relatedProducts: ["demo-car-steering-rack-kit"]
    },
    {
      id: "demo-truck-common-rail-fuel-pump",
      slug: "common-rail-fuel-pump-unit",
      sku: "AX-TRK-CRP-8206",
      name: "Common Rail Fuel Pump Unit",
      vehicleType: "HEAVY TRUCK",
      category: "engine-parts",
      subcategory: "Fuel System",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-TRK-CRP-8206",
      oemNumbers: ["8973060449", "294000-0039"],
      vehicleBrand: "HINO",
      vehicleBrands: ["HINO", "ISUZU"],
      vehicleModels: ["700", "Medium Duty"],
      engineModels: ["E13C", "4HK1"],
      yearFrom: 2014,
      yearTo: 2022,
      shortDescription:
        "Heavy-duty fuel system part for commercial vehicle sourcing, fleet enquiries and engine-code verification.",
      description:
        "A heavy-truck fuel system product structured around OEM number, commercial vehicle model, engine model and direct enquiry.",
      features: [
        "Heavy vehicle engine-code support",
        "Fleet sourcing enquiry ready",
        "Multiple OEM number display",
        "Shared product template with passenger car parts"
      ],
      weight: "5.8 kg",
      dimensions: "310 x 180 x 165 mm",
      material: "Machined steel, aluminum housing",
      position: "Fuel injection system",
      mainImage: "/assets/products/truck-fuel-pump.svg",
      images: [
        "/assets/products/truck-fuel-pump.svg",
        "/assets/categories/engine-parts.svg",
        "/assets/products/clutch-assembly.svg"
      ],
      imageAlt: "AXRIVO common rail fuel pump unit placeholder",
      compatibility: [
        { vehicleBrand: "HINO", vehicleModel: "700", engineModel: "E13C", notes: "Heavy-duty highway platform" },
        { vehicleBrand: "ISUZU", vehicleModel: "Medium Duty", engineModel: "4HK1", notes: "Commercial fleet application" }
      ],
      keywords: ["HINO E13C", "E13C", "ISUZU 4HK1", "fuel pump", "common rail", "8973060449"],
      featured: true,
      newArrival: false,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-truck-e13c-turbocharger", "demo-truck-clutch-assembly", "demo-truck-radiator-core"]
    },
    {
      id: "demo-truck-e13c-turbocharger",
      slug: "e13c-turbocharger-assembly",
      sku: "AX-TRK-TBO-8123",
      name: "E13C Turbocharger Assembly",
      vehicleType: "HEAVY TRUCK",
      category: "engine-parts",
      subcategory: "Turbocharger",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-TRK-TBO-8123",
      oemNumbers: ["898123456", "24100-E0A10"],
      vehicleBrand: "HINO",
      vehicleBrands: ["HINO"],
      vehicleModels: ["700"],
      engineModels: ["E13C"],
      yearFrom: 2012,
      yearTo: 2021,
      shortDescription: "Turbocharger assembly example for HINO E13C heavy truck applications.",
      description:
        "A heavy-duty engine air system product with searchable E13C, turbo and OEM number relationships.",
      features: ["E13C engine matching", "Turbo keyword search support", "OEM-number enquiry ready"],
      weight: "13.2 kg",
      dimensions: "360 x 310 x 280 mm",
      material: "Cast iron, steel turbine, aluminum compressor housing",
      position: "Engine turbocharger",
      mainImage: "/assets/categories/engine-parts.svg",
      images: ["/assets/categories/engine-parts.svg", "/assets/products/truck-fuel-pump.svg"],
      imageAlt: "E13C turbocharger assembly placeholder",
      compatibility: [
        { vehicleBrand: "HINO", vehicleModel: "700", year: "2012-2021", engine: "12.9L", engineModel: "E13C" }
      ],
      keywords: ["turbo E13C", "HINO E13C", "898123456", "turbocharger", "HINO 700"],
      featured: true,
      newArrival: true,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-truck-common-rail-fuel-pump", "demo-truck-radiator-core"]
    },
    {
      id: "demo-truck-wd615-turbocharger",
      slug: "wd615-turbocharger-assembly",
      sku: "AX-TRK-TBO-6150",
      name: "WD615 Turbocharger Assembly",
      vehicleType: "HEAVY TRUCK",
      category: "engine-parts",
      subcategory: "Turbocharger",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-TRK-TBO-6150",
      oemNumbers: ["VG1560118229"],
      vehicleBrand: "HOWO",
      vehicleBrands: ["HOWO"],
      vehicleModels: ["A7", "Sinotruk"],
      engineModels: ["WD615"],
      yearFrom: 2010,
      yearTo: 2020,
      shortDescription: "Turbocharger assembly demo for HOWO WD615 heavy truck engine applications.",
      description: "A heavy-truck engine part prepared for WD615 and HOWO model search.",
      features: ["WD615 search relationship", "HOWO heavy truck application", "Direct enquiry action"],
      weight: "12.8 kg",
      dimensions: "355 x 305 x 270 mm",
      material: "Cast iron, steel turbine, aluminum compressor housing",
      position: "Engine turbocharger",
      mainImage: "/assets/categories/engine-parts.svg",
      images: ["/assets/categories/engine-parts.svg", "/assets/products/truck-fuel-pump.svg"],
      imageAlt: "WD615 turbocharger assembly placeholder",
      compatibility: [
        { vehicleBrand: "HOWO", vehicleModel: "A7", year: "2010-2020", engine: "Diesel", engineModel: "WD615" }
      ],
      keywords: ["WD615", "HOWO", "Sinotruk", "turbo", "VG1560118229"],
      featured: false,
      newArrival: true,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-truck-e13c-turbocharger", "demo-truck-common-rail-fuel-pump"]
    },
    {
      id: "demo-truck-clutch-assembly",
      slug: "heavy-duty-clutch-assembly",
      sku: "AX-TRK-CLT-5104",
      name: "Heavy-Duty Clutch Assembly",
      vehicleType: "HEAVY TRUCK",
      category: "clutch",
      subcategory: "Clutch Assembly",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-TRK-CLT-5104",
      oemNumbers: ["ME521190", "31210-37120"],
      vehicleBrand: "FUSO",
      vehicleBrands: ["FUSO", "HINO"],
      vehicleModels: ["Canter", "500"],
      engineModels: ["4D34", "J05E"],
      yearFrom: 2011,
      yearTo: 2022,
      shortDescription: "Heavy-duty clutch assembly for commercial transmission service.",
      description: "A clutch product example for heavy truck category pages and related product links.",
      features: ["Commercial vehicle drivetrain support", "Clutch category route", "Multiple OEM references"],
      weight: "18.4 kg",
      dimensions: "430 x 430 x 115 mm",
      material: "Friction material, steel pressure plate",
      position: "Clutch assembly",
      mainImage: "/assets/products/clutch-assembly.svg",
      images: ["/assets/products/clutch-assembly.svg", "/assets/categories/clutch-transmission.svg"],
      imageAlt: "Heavy-duty clutch assembly placeholder",
      compatibility: [
        { vehicleBrand: "FUSO", vehicleModel: "Canter", year: "2011-2022", engineModel: "4D34" },
        { vehicleBrand: "HINO", vehicleModel: "500", year: "2014-2022", engineModel: "J05E" }
      ],
      keywords: ["clutch", "FUSO Canter", "HINO 500", "ME521190"],
      featured: true,
      newArrival: false,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-truck-transmission-gear-kit", "demo-truck-differential-seal-set"]
    },
    {
      id: "demo-truck-air-brake-drum",
      slug: "air-brake-drum-assembly",
      sku: "AX-TRK-BDM-6608",
      name: "Air Brake Drum Assembly",
      vehicleType: "HEAVY TRUCK",
      category: "brake-system",
      subcategory: "Brake Drum",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-TRK-BDM-6608",
      oemNumbers: ["43512-E0080", "42431-E0050"],
      vehicleBrand: "ISUZU",
      vehicleBrands: ["ISUZU", "UD"],
      vehicleModels: ["N-Series", "Quon"],
      engineModels: ["4HK1", "GH11"],
      yearFrom: 2012,
      yearTo: 2023,
      shortDescription: "Brake drum assembly for heavy commercial brake service.",
      description: "A heavy-duty brake part built for brake drum, OEM and fleet search examples.",
      features: ["Brake drum search ready", "Commercial brake category", "Truck model relationship"],
      weight: "21.6 kg",
      dimensions: "410 x 410 x 230 mm",
      material: "Cast iron",
      position: "Wheel brake assembly",
      mainImage: "/assets/categories/brake-system.svg",
      images: ["/assets/categories/brake-system.svg", "/assets/products/brake-rotor-set.svg"],
      imageAlt: "Air brake drum assembly placeholder",
      compatibility: [
        { vehicleBrand: "ISUZU", vehicleModel: "N-Series", year: "2012-2023", engineModel: "4HK1" },
        { vehicleBrand: "UD", vehicleModel: "Quon", year: "2014-2022", engineModel: "GH11" }
      ],
      keywords: ["brake drum", "air brake", "ISUZU 4HK1", "UD Quon"],
      featured: true,
      newArrival: true,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-truck-common-rail-fuel-pump"]
    },
    {
      id: "demo-truck-radiator-core",
      slug: "high-capacity-radiator-core",
      sku: "AX-TRK-RAD-5320",
      name: "High-Capacity Radiator Core",
      vehicleType: "HEAVY TRUCK",
      category: "cooling",
      subcategory: "Radiator",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-TRK-RAD-5320",
      oemNumbers: ["17900-78010"],
      vehicleBrand: "VOLVO",
      vehicleBrands: ["VOLVO", "SCANIA"],
      vehicleModels: ["FH", "P-Series"],
      engineModels: ["D13", "DC13"],
      yearFrom: 2015,
      yearTo: 2022,
      shortDescription: "Heavy vehicle radiator core for fleet cooling-system service.",
      description: "A cooling product example for heavy truck brand and engine model pages.",
      features: ["Fleet cooling support", "Heavy-duty dimensions", "Brand page relationship"],
      weight: "16.8 kg",
      dimensions: "920 x 710 x 78 mm",
      material: "Aluminum core, reinforced tank",
      position: "Front cooling module",
      mainImage: "/assets/products/radiator-core.svg",
      images: ["/assets/products/radiator-core.svg", "/assets/categories/cooling-system.svg"],
      imageAlt: "High-capacity radiator core placeholder",
      compatibility: [
        { vehicleBrand: "VOLVO", vehicleModel: "FH", year: "2015-2022", engineModel: "D13" },
        { vehicleBrand: "SCANIA", vehicleModel: "P-Series", year: "2016-2022", engineModel: "DC13" }
      ],
      keywords: ["radiator", "VOLVO FH", "SCANIA", "D13", "DC13"],
      featured: true,
      newArrival: false,
      popular: false,
      status: "demo",
      relatedProducts: ["demo-truck-e13c-turbocharger"]
    },
    {
      id: "demo-truck-transmission-gear-kit",
      slug: "transmission-gear-service-kit",
      sku: "AX-TRK-TRN-9027",
      name: "Transmission Gear Service Kit",
      vehicleType: "HEAVY TRUCK",
      category: "transmission",
      subcategory: "Gear Service",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-TRK-TRN-9027",
      oemNumbers: ["33321-37020"],
      vehicleBrand: "MAN",
      vehicleBrands: ["MAN", "HINO"],
      vehicleModels: ["TGS", "700"],
      engineModels: ["D26", "E13C"],
      yearFrom: 2013,
      yearTo: 2021,
      shortDescription: "Transmission gear service kit for heavy truck drivetrain repair.",
      description: "A transmission category product with truck model and engine relationships.",
      features: ["Transmission category route", "Heavy drivetrain service", "Internal linking ready"],
      weight: "9.5 kg",
      dimensions: "330 x 240 x 160 mm",
      material: "Heat-treated steel",
      position: "Transmission assembly",
      mainImage: "/assets/categories/clutch-transmission.svg",
      images: ["/assets/categories/clutch-transmission.svg", "/assets/products/clutch-assembly.svg"],
      imageAlt: "Transmission gear service kit placeholder",
      compatibility: [
        { vehicleBrand: "MAN", vehicleModel: "TGS", year: "2013-2021", engineModel: "D26" },
        { vehicleBrand: "HINO", vehicleModel: "700", year: "2014-2021", engineModel: "E13C" }
      ],
      keywords: ["transmission", "gear kit", "MAN TGS", "HINO 700"],
      featured: false,
      newArrival: true,
      popular: false,
      status: "demo",
      relatedProducts: ["demo-truck-clutch-assembly", "demo-truck-differential-seal-set"]
    },
    {
      id: "demo-truck-differential-seal-set",
      slug: "differential-seal-repair-set",
      sku: "AX-TRK-DIF-3842",
      name: "Differential Seal Repair Set",
      vehicleType: "HEAVY TRUCK",
      category: "differential",
      subcategory: "Seal Repair",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-TRK-DIF-3842",
      oemNumbers: ["90311-62001"],
      vehicleBrand: "HINO",
      vehicleBrands: ["HINO", "ISUZU"],
      vehicleModels: ["500", "F-Series"],
      engineModels: ["J08E", "6HK1"],
      yearFrom: 2010,
      yearTo: 2020,
      shortDescription: "Differential seal repair set for rear axle service.",
      description: "A differential product example for drivetrain category and related product paths.",
      features: ["Differential category support", "Rear axle position", "Truck fitment structure"],
      weight: "1.1 kg",
      dimensions: "160 x 150 x 48 mm",
      material: "Rubber, steel ring",
      position: "Rear axle differential",
      mainImage: "/assets/products/clutch-assembly.svg",
      images: ["/assets/products/clutch-assembly.svg"],
      imageAlt: "Differential seal repair set placeholder",
      compatibility: [
        { vehicleBrand: "HINO", vehicleModel: "500", year: "2010-2020", engineModel: "J08E" },
        { vehicleBrand: "ISUZU", vehicleModel: "F-Series", year: "2010-2020", engineModel: "6HK1" }
      ],
      keywords: ["differential", "rear axle", "seal", "90311"],
      featured: false,
      newArrival: false,
      popular: true,
      status: "demo",
      relatedProducts: ["demo-truck-clutch-assembly", "demo-truck-transmission-gear-kit"]
    },
    {
      id: "demo-truck-steering-drag-link",
      slug: "steering-drag-link-assembly",
      sku: "AX-TRK-STR-7188",
      name: "Steering Drag Link Assembly",
      vehicleType: "HEAVY TRUCK",
      category: "steering",
      subcategory: "Drag Link",
      brand: "AXRIVO",
      manufacturer: "OEM Supplier",
      partNumber: "AX-TRK-STR-7188",
      oemNumbers: ["45420-E0010"],
      vehicleBrand: "HINO",
      vehicleBrands: ["HINO", "FUSO"],
      vehicleModels: ["500", "Fighter"],
      engineModels: ["J08E", "6M60"],
      yearFrom: 2012,
      yearTo: 2021,
      shortDescription: "Steering drag link assembly for heavy vehicle steering service.",
      description: "A heavy steering product with model, engine and position fields.",
      features: ["Steering category", "Commercial chassis application", "Part-number search ready"],
      weight: "6.4 kg",
      dimensions: "980 x 90 x 90 mm",
      material: "Steel, ball joint ends",
      position: "Steering linkage",
      mainImage: "/assets/categories/steering.svg",
      images: ["/assets/categories/steering.svg"],
      imageAlt: "Steering drag link assembly placeholder",
      compatibility: [
        { vehicleBrand: "HINO", vehicleModel: "500", year: "2012-2021", engineModel: "J08E" },
        { vehicleBrand: "FUSO", vehicleModel: "Fighter", year: "2012-2021", engineModel: "6M60" }
      ],
      keywords: ["steering", "drag link", "HINO 500", "FUSO Fighter"],
      featured: false,
      newArrival: false,
      popular: false,
      status: "demo",
      relatedProducts: ["demo-truck-differential-seal-set"]
    }
  ];

  const popularBrands = {
    CAR: ["Toyota", "Honda", "Nissan", "Mazda", "Mitsubishi", "Perodua", "Proton", "Ford"],
    "HEAVY TRUCK": ["HINO", "ISUZU", "FUSO", "HOWO", "VOLVO", "SCANIA", "UD", "MAN"]
  };

  const productImportStandard = {
    version: "2026-09-01",
    rule: "Every AXRIVO product import must include Product Data, SEO, GEO, Image SEO, Internal Linking, Structured Data, Search Index and Sitemap unless the user explicitly says not to do SEO/GEO.",
    dataFields: [
      "id",
      "slug",
      "name",
      "sku",
      "partNumber",
      "oemNumbers",
      "brand",
      "manufacturer",
      "category",
      "subcategory",
      "vehicleType",
      "vehicleBrand",
      "vehicleBrands",
      "vehicleModels",
      "engineModels",
      "yearFrom",
      "yearTo",
      "position",
      "application",
      "weight",
      "dimensions",
      "material",
      "shortDescription",
      "description",
      "features",
      "compatibility",
      "keywords",
      "mainImage",
      "images",
      "imageAlt",
      "imageSeo",
      "seo",
      "geo",
      "relatedProducts"
    ],
    duplicateKeys: ["id", "slug", "sku", "partNumber", "oemNumbers"],
    searchIndexFields: [
      "name",
      "partNumber",
      "oemNumbers",
      "sku",
      "brand",
      "manufacturer",
      "vehicleBrands",
      "vehicleModels",
      "engineModels",
      "category",
      "subcategory",
      "keywords",
      "compatibility",
      "seo",
      "geo"
    ],
    workflow: [
      "duplicate-check",
      "data-normalization",
      "image-seo",
      "product-page",
      "page-seo",
      "geo-entity-structure",
      "structured-data",
      "internal-linking",
      "search-index",
      "sitemap",
      "import-report"
    ],
    importReportFields: [
      "Imported",
      "SEO",
      "GEO",
      "Image SEO",
      "Search Index",
      "Schema",
      "Sitemap",
      "Duplicate Check",
      "Missing Information"
    ]
  };

  const normalizeText = (value) =>
    String(value ?? "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  const slugify = (value) => normalizeText(value).replace(/\s+/g, "-");

  const compact = (items) => items.filter((item) => item !== undefined && item !== null && String(item).trim() !== "");

  const unique = (items) => [...new Set(compact(items).map((item) => String(item).trim()))];

  const categoryBySlug = (slug) => categories.find((category) => category.slug === slug);

  const categoryName = (slug) => categoryBySlug(slug)?.name ?? slug;

  const productUrl = (product) => `/${product.vehicleType === "HEAVY TRUCK" ? "heavy-truck-parts" : "car-parts"}/product/${product.slug}/`;

  const firstOemNumber = (product) => product.oemNumbers?.[0] ?? product.oemNumber ?? product.oem ?? "";

  const buildProductSeo = (product) => {
    const category = categoryName(product.category);
    const primaryOem = firstOemNumber(product);
    const application = compact([...(product.vehicleBrands ?? []), ...(product.vehicleModels ?? [])]).join(" ");
    const titleBase = compact([product.name, primaryOem]).join(" ");
    const descriptionBase = compact([
      product.shortDescription,
      application ? `Application: ${application}.` : "",
      product.engineModels?.length ? `Engine: ${product.engineModels.join(" / ")}.` : "",
      primaryOem ? `OEM: ${primaryOem}.` : ""
    ]).join(" ");

    return {
      title: product.seo?.title ?? `${titleBase || product.name} | AXRIVO`,
      description:
        product.seo?.description ??
        (descriptionBase ||
          `${product.name} product information with OEM, part number, vehicle compatibility and direct AXRIVO enquiry support.`),
      canonicalPath: product.seo?.canonicalPath ?? productUrl(product),
      image: product.seo?.image ?? product.mainImage,
      robots: product.seo?.robots ?? "index,follow",
      keywords: unique([...(product.keywords ?? []), ...(product.seo?.keywords ?? []), category, product.brand, product.partNumber, primaryOem])
    };
  };

  const productImageAlt = (product, src) =>
    product.imageSeo?.altTextByImage?.[src] ??
    product.imageSeo?.altText ??
    product.imageAlt ??
    (compact([...(product.vehicleBrands ?? []), ...(product.engineModels ?? []), product.name, firstOemNumber(product)]).join(" ") ||
      `${product.name} product image`);

  const productEntityMap = (product) => ({
    product: product.name,
    oemNumbers: product.oemNumbers ?? [],
    partNumber: product.partNumber,
    brand: product.brand,
    manufacturer: product.manufacturer,
    vehicleType: product.vehicleType,
    vehicleBrands: product.vehicleBrands ?? [product.vehicleBrand].filter(Boolean),
    vehicleModels: product.vehicleModels ?? [],
    engineModels: product.engineModels ?? [],
    category: categoryName(product.category),
    subcategory: product.subcategory,
    application: product.application ?? compact([...(product.vehicleBrands ?? []), ...(product.vehicleModels ?? [])]).join(" / ")
  });

  const productSearchText = (product) =>
    normalizeText(
      [
        product.id,
        product.slug,
        product.sku,
        product.name,
        product.vehicleType,
        categoryName(product.category),
        product.subcategory,
        product.brand,
        product.manufacturer,
        product.partNumber,
        ...(product.oemNumbers ?? []),
        product.vehicleBrand,
        ...(product.vehicleBrands ?? []),
        ...(product.vehicleModels ?? []),
        ...(product.engineModels ?? []),
        product.yearFrom,
        product.yearTo,
        product.description,
        product.shortDescription,
        product.position,
        product.application,
        product.weight,
        product.dimensions,
        product.material,
        ...(product.features ?? []),
        ...(product.keywords ?? []),
        product.seo?.title,
        product.seo?.description,
        ...(product.seo?.keywords ?? []),
        ...(product.searchTerms ?? []),
        ...(product.geo?.entities ?? []),
        ...(product.geo?.entityRelations ?? []).flatMap((relation) => [relation.from, relation.type, relation.to]),
        ...(product.compatibility ?? []).flatMap((row) => [
          row.vehicleBrand,
          row.vehicleModel,
          row.year,
          row.engine,
          row.engineModel,
          row.notes
        ])
      ].join(" ")
    );

  const sortProducts = (items, sort = "relevance") => {
    const sorted = [...items];

    if (sort === "newest") {
      sorted.sort((a, b) => Number(Boolean(b.newArrival)) - Number(Boolean(a.newArrival)) || a.name.localeCompare(b.name));
      return sorted;
    }

    if (sort === "az") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      return sorted;
    }

    return sorted;
  };

  const productMatchesFilter = (product, filters = {}) => {
    const type = filters.vehicleType;
    const category = filters.category;
    const brand = filters.brand;
    const vehicleBrand = filters.vehicleBrand;
    const vehicleModel = filters.vehicleModel;
    const engineModel = filters.engineModel;
    const year = filters.year;

    if (type && product.vehicleType !== type) return false;
    if (category && product.category !== category) return false;
    if (brand && slugify(product.brand) !== slugify(brand)) return false;
    if (vehicleBrand && !(product.vehicleBrands ?? [product.vehicleBrand]).some((item) => slugify(item) === slugify(vehicleBrand))) {
      return false;
    }
    if (vehicleModel && !(product.vehicleModels ?? []).some((item) => slugify(item) === slugify(vehicleModel))) {
      return false;
    }
    if (engineModel && !(product.engineModels ?? []).some((item) => normalizeText(item).includes(normalizeText(engineModel)))) {
      return false;
    }
    if (year && product.yearFrom && product.yearTo) {
      const parsedYear = Number(year);
      if (parsedYear < product.yearFrom || parsedYear > product.yearTo) return false;
    }

    return true;
  };

  const searchProducts = ({ query = "", filters = {}, sort = "relevance", limit } = {}) => {
    const normalizedQuery = normalizeText(query);
    const tokens = normalizedQuery ? normalizedQuery.split(/\s+/).filter(Boolean) : [];
    const scored = products
      .filter((product) => productMatchesFilter(product, filters))
      .map((product) => {
        const haystack = productSearchText(product);
        const directScore = normalizedQuery && haystack.includes(normalizedQuery) ? 20 : 0;
        const matchedTokens = tokens.filter((token) => haystack.includes(token));
        const tokenScore = matchedTokens.length * 4 - (tokens.length - matchedTokens.length) * 2;
        const qualityScore = Number(Boolean(product.featured)) + Number(Boolean(product.popular));
        const usefulMatch =
          !tokens.length ||
          Boolean(directScore) ||
          matchedTokens.length === tokens.length ||
          (tokens.length > 3 && matchedTokens.length >= Math.ceil(tokens.length * 0.75));

        return {
          product,
          score: directScore + tokenScore + qualityScore,
          usefulMatch
        };
      })
      .filter((item) => !tokens.length || item.usefulMatch);

    if (sort === "relevance") {
      scored.sort((a, b) => b.score - a.score || a.product.name.localeCompare(b.product.name));
    }

    const sorted = sort === "relevance" ? scored.map((item) => item.product) : sortProducts(scored.map((item) => item.product), sort);
    return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
  };

  const getProductsByVehicleType = (vehicleType) => products.filter((product) => product.vehicleType === vehicleType);

  const getCategoriesForVehicleType = (vehicleType) =>
    categories.filter((category) => category.vehicleTypes.includes(vehicleType));

  const getProductsByCategory = (vehicleType, categorySlug, filters = {}) =>
    searchProducts({ filters: { ...filters, vehicleType, category: categorySlug }, sort: filters.sort ?? "relevance" });

  const getBrandProducts = (brandSlug, filters = {}) =>
    searchProducts({ filters, sort: filters.sort ?? "relevance" }).filter((product) =>
      (product.vehicleBrands ?? [product.vehicleBrand]).some((brand) => slugify(brand) === brandSlug)
    );

  const getVehicleBrands = (vehicleType) =>
    unique(
      [
        ...products
          .filter((product) => !vehicleType || product.vehicleType === vehicleType)
          .flatMap((product) => product.vehicleBrands ?? [product.vehicleBrand]),
        ...(vehicleType ? popularBrands[vehicleType] ?? [] : Object.values(popularBrands).flat())
      ]
    );

  const getCompatibilityRows = (vehicleType, vehicleBrand, vehicleModel, year) =>
    products
      .filter((product) => productMatchesFilter(product, { vehicleType }))
      .flatMap((product) => product.compatibility ?? [])
      .filter((row) => {
        if (vehicleBrand && slugify(row.vehicleBrand) !== slugify(vehicleBrand)) return false;
        if (vehicleModel && slugify(row.vehicleModel) !== slugify(vehicleModel)) return false;
        if (year && row.year && !String(row.year).includes(String(year))) return false;
        return true;
      });

  const getVehicleModels = (vehicleType, vehicleBrand) => {
    if (vehicleBrand) {
      return unique(getCompatibilityRows(vehicleType, vehicleBrand).map((row) => row.vehicleModel));
    }

    return unique(
      products
        .filter((product) => productMatchesFilter(product, { vehicleType }))
        .flatMap((product) => product.vehicleModels)
    );
  };

  const getEngineModels = (vehicleType, vehicleBrand, vehicleModel, year) => {
    if (vehicleBrand || vehicleModel || year) {
      return unique(getCompatibilityRows(vehicleType, vehicleBrand, vehicleModel, year).map((row) => row.engineModel));
    }

    return unique(
      products
        .filter((product) => productMatchesFilter(product, { vehicleType }))
        .flatMap((product) => product.engineModels)
    );
  };

  const getYears = (vehicleType, vehicleBrand, vehicleModel) => {
    const rows = getCompatibilityRows(vehicleType, vehicleBrand, vehicleModel);
    const years = rows.length
      ? rows.flatMap((row) => {
          if (!row.year) return [];
          const match = String(row.year).match(/^(\d{4})-(\d{4})$/);

          if (!match) {
            return [String(row.year)];
          }

          const start = Number(match[1]);
          const end = Number(match[2]);
          return Array.from({ length: end - start + 1 }, (_, index) => String(start + index));
        })
      : products
          .filter((product) => productMatchesFilter(product, { vehicleType, vehicleBrand, vehicleModel }))
          .flatMap((product) => {
            if (!product.yearFrom || !product.yearTo) return [];
            const length = product.yearTo - product.yearFrom + 1;
            return Array.from({ length }, (_, index) => String(product.yearFrom + index));
          });

    return unique(years).sort((a, b) => Number(b) - Number(a));
  };

  const getVehicleOptions = (vehicleType, selection = {}) => ({
    brands: getVehicleBrands(vehicleType),
    models: getVehicleModels(vehicleType, selection.vehicleBrand),
    years: getYears(vehicleType, selection.vehicleBrand, selection.vehicleModel),
    engines: getEngineModels(vehicleType, selection.vehicleBrand, selection.vehicleModel, selection.year)
  });

  const getFilterOptions = (items = products) => ({
    vehicleTypes: unique(items.map((product) => product.vehicleType)),
    categories: unique(items.map((product) => product.category)),
    brands: unique(items.map((product) => product.brand)),
    vehicleBrands: unique(items.flatMap((product) => product.vehicleBrands ?? [product.vehicleBrand])),
    engineModels: unique(items.flatMap((product) => product.engineModels))
  });

  const getRelatedProducts = (product, limit = 4) => {
    const relatedIds = product.relatedProducts ?? [];
    const related = relatedIds.map((id) => products.find((item) => item.id === id)).filter(Boolean);

    if (related.length >= limit) {
      return related.slice(0, limit);
    }

    const fallback = products.filter(
      (item) => item.id !== product.id && item.vehicleType === product.vehicleType && item.category === product.category
    );

    return [...related, ...fallback.filter((item) => !related.includes(item))].slice(0, limit);
  };

  const getProductByRoute = (routeBase, slug) => {
    const vehicleType = routeBase === "heavy-truck-parts" ? "HEAVY TRUCK" : "CAR";
    return products.find((product) => product.vehicleType === vehicleType && product.slug === slug) ?? null;
  };

  const getProductById = (id) => products.find((product) => product.id === id) ?? null;

  const getProductBySlug = (slug) => products.find((product) => product.slug === slug) ?? null;

  const getBrandSummary = (brandSlug) => {
    const brandProducts = getBrandProducts(brandSlug);
    const label =
      getVehicleBrands().find((brand) => slugify(brand) === brandSlug) ??
      brandSlug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ");

    return {
      slug: brandSlug,
      name: label,
      products: brandProducts,
      vehicleTypes: unique(brandProducts.map((product) => product.vehicleType)),
      categories: unique(brandProducts.map((product) => product.category)),
      vehicleModels: unique(brandProducts.flatMap((product) => product.vehicleModels))
    };
  };

  window.AXRIVO_PRODUCT_DATA = {
    categories,
    popularBrands,
    productImportStandard,
    products
  };

  window.AXRIVO_CATALOG = {
    buildProductSeo,
    categoryBySlug,
    categoryName,
    compact,
    getBrandProducts,
    getBrandSummary,
    getCategoriesForVehicleType,
    getEngineModels,
    getFilterOptions,
    getProductById,
    getProductByRoute,
    getProductBySlug,
    getProducts: () => [...products],
    getProductsByCategory,
    getProductsByVehicleType,
    getRelatedProducts,
    getPopularBrands: (vehicleType) => (vehicleType ? [...(popularBrands[vehicleType] ?? [])] : Object.values(popularBrands).flat()),
    getVehicleBrands,
    getVehicleModels,
    getVehicleOptions,
    getYears,
    normalizeText,
    productEntityMap,
    productImageAlt,
    productSearchText,
    productUrl,
    searchProducts,
    slugify,
    sortProducts,
    unique
  };
})();
