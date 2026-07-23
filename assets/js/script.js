document.addEventListener('DOMContentLoaded', function() {
  // ---- Inisialisasi Peta & Carousel Lokasi ----
  const mapContainer = document.getElementById('map');
  if (mapContainer) {
    const center = [-7.6298, 108.6512];
    const map = L.map('map', {
      scrollWheelZoom: true,
      zoomControl: false, // Hapus kontrol zoom default
    }).setView(center, 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);
    L.control.zoom({ position: 'topright' }).addTo(map); // Pindahkan kontrol zoom ke kanan atas

    // Ikon marker kustom
    const pinIcon = L.divIcon({
      className: 'leaflet-marker-icon',
      html: '<div class="marker-pin"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 20],
    });

    const activePinIcon = L.divIcon({
      className: 'leaflet-marker-icon is-active',
      html: '<div class="marker-pin"></div>',
      iconSize: [20, 20],
      iconAnchor: [10, 20],
    });

    // 1. Data Array untuk Lokasi
    const locationsData = [
      { id: 'warung-yayah', nama: "Warung Bu Yayah", deskripsi: "Tempat makan sederhana dengan pemandangan laut.", jarak: "± 500m dari pusat", lat: -7.6305, lng: 108.6518, img: 'https://picsum.photos/seed/warung1/400/300', gambarRuko: 'https://picsum.photos/seed/ruko1/400/300', nomorWA: '6281234567890' },
      { id: 'toko-bahari-jaya', nama: "Toko Oleh-Oleh Bahari Jaya", deskripsi: "Pusat oleh-oleh terlengkap di area wisata.", jarak: "± 1.2km dari pusat", lat: -7.6281, lng: 108.6557, img: 'https://picsum.photos/seed/toko1/400/300', gambarRuko: 'https://picsum.photos/seed/ruko2/400/300', nomorWA: '6281234567891' },
      { id: 'koperasi-mina', nama: "Koperasi Nelayan Mina Sejahtera", deskripsi: "Dapatkan produk langsung dari koperasi nelayan.", jarak: "± 1.5km dari pusat", lat: -7.6336, lng: 108.6490, img: 'https://picsum.photos/seed/koperasi1/400/300', gambarRuko: 'https://picsum.photos/seed/ruko3/400/300', nomorWA: '6281234567892' },
      { id: 'restoran-pesisir', nama: "Restoran Pesisir Indah", deskripsi: "Nikmati hidangan laut sambil membeli oleh-oleh.", jarak: "± 800m dari pusat", lat: -7.6275, lng: 108.6475, img: 'https://picsum.photos/seed/resto1/400/300', gambarRuko: 'https://picsum.photos/seed/ruko4/400/300', nomorWA: '6281234567893' }
    ];

    const carouselContainer = document.getElementById('location-carousel');
    const markers = {};

    // Fungsi untuk menandai marker aktif di peta
    const setActiveItem = (locationId) => {
      // Reset semua marker
      Object.values(markers).forEach(m => m.setIcon(pinIcon).setZIndexOffset(0));

      if (locationId) {
        // Aktifkan marker yang sesuai
        const activeMarker = markers[locationId];
        if (activeMarker) {
          activeMarker.setIcon(activePinIcon).setZIndexOffset(1000);
        }
      }
    };

    // 2. Generate Kartu dan Marker
    locationsData.forEach((location, index) => {
      // Buat elemen Slide untuk Swiper
      const slide = document.createElement('div');
      slide.className = "swiper-slide w-64 md:w-72"; // Lebar slide
      slide.dataset.locationId = location.id;
      // Simpan koordinat di slide untuk sinkronisasi
      slide.dataset.lat = location.lat;
      slide.dataset.lng = location.lng;

      slide.innerHTML = `
        <div class="location-card h-full bg-navy/60 backdrop-blur-lg border border-sand/10 rounded-3xl shadow-lg transition-all duration-300 hover:border-sand/30 overflow-hidden cursor-pointer">
            <img src="${location.img}" alt="Gambar ${location.nama}" class="h-32 w-full object-cover" loading="lazy">
            <div class="p-4 text-left">
                <h3 class="font-kaftus font-semibold text-xl text-sand">${location.nama}</h3>
                <p class="text-xs text-sand/60 mt-1 mb-2">${location.jarak}</p>
                <p class="text-sm text-sand/80 leading-relaxed line-clamp-2">${location.deskripsi}</p>
            </div>
        </div>
      `;
      carouselContainer.appendChild(slide);

      // Buat konten HTML untuk Popup
      const popupContent = `
        <div class="flex flex-col gap-3 font-poppins text-ink" style="width: 240px;">
            <img src="${location.gambarRuko}" alt="Foto ${location.nama}" class="w-full h-28 object-cover rounded-lg shadow-md">
            <h3 class="font-bold text-lg leading-tight">${location.nama}</h3>
            <div class="flex flex-col gap-2 mt-1">
                <a href="https://wa.me/${location.nomorWA}?text=Halo,%20saya%20ingin%20memesan%20Sambal%20Cumi" target="_blank" rel="noopener noreferrer" class="bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-md flex items-center justify-center gap-2 no-underline transition-all duration-200 hover:bg-emerald-600 hover:shadow-lg hover:-translate-y-0.5">
                    💬 Pesan Sekarang
                </a>
                <a href="https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}" target="_blank" rel="noopener noreferrer" class="bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-md flex items-center justify-center gap-2 no-underline transition-all duration-200 hover:bg-gray-900 hover:shadow-lg hover:-translate-y-0.5">
                    📍 Rute ke Lokasi
                </a>
            </div>
        </div>
      `;

      // Buat Marker di Peta dan ikat dengan Popup
      const marker = L.marker([location.lat, location.lng], { icon: pinIcon, locationId: location.id, autoPan: true })
        .addTo(map)
        .bindPopup(popupContent, { minWidth: 240 });

      markers[location.id] = marker;

      // 3. Interaksi: Saat popup marker terbuka, geser Swiper ke slide yang sesuai
      // Ini untuk menjaga sinkronisasi dua arah antara peta dan carousel
      marker.on('popupopen', () => {
        if (swiper) {
          swiper.slideTo(index);
        }
      });
    });

    // 4. Inisialisasi Swiper.js
    const swiper = new Swiper('.location-swiper', {
      effect: 'coverflow',
      grabCursor: true,
      centeredSlides: true,
      slidesPerView: 'auto',
      coverflowEffect: {
        rotate: 0,
        stretch: 0,
        depth: 150,
        modifier: 2.5,
        slideShadows: false,
      },
      initialSlide: 0, // Mulai dari slide pertama
    });

    // 5. Sinkronisasi: Swiper -> Peta
    swiper.on('slideChange', function () {
      const activeSlide = this.slides[this.activeIndex];
      const lat = parseFloat(activeSlide.dataset.lat);
      const lng = parseFloat(activeSlide.dataset.lng);
      const locationId = activeSlide.dataset.locationId;

      if (!isNaN(lat) && !isNaN(lng)) {
        map.flyTo([lat, lng], 17, { animate: true, duration: 1.5 });
        setActiveItem(locationId);
      }
    });

    // 6. Reset tampilan saat peta diklik di luar marker
    map.on('click', () => {
      setActiveItem(null); // Hapus semua item aktif
      map.flyTo(center, 15, { animate: true, duration: 1.0 }); // Kembali ke tengah
    });

    // 7. Atur posisi awal peta
    const initialLocation = locationsData[0];
    if (initialLocation) {
      map.setView([initialLocation.lat, initialLocation.lng], 17);
      setActiveItem(initialLocation.id);
    }
  }

  // ---- Tab Navigation Logic ----
  const tabs = document.querySelectorAll('.tab-item');
  const sections = document.querySelectorAll('header, section');

  // Smooth scroll on tab click
  tabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Highlight active tab on scroll
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        tabs.forEach(t => {
          const href = t.getAttribute('href');
          if (href === '#' + id) {
            t.classList.add('active');
          } else {
            t.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.5 }); // 50% of the section must be visible

  sections.forEach(section => {
    observer.observe(section);
  });

  // --- ANIMASI SAAT SCROLL ---
    const animatedSections = document.querySelectorAll('.fade-in-section');

    const sectionObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });

    animatedSections.forEach(section => {
      sectionObserver.observe(section);
    });
});