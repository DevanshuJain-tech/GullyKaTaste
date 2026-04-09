import { useEffect, useRef, useState } from "react";
import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import { AlertCircle, MapPin } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface Vendor {
  id: string;
  name: string;
  nameHi?: string;
  latitude: number;
  longitude: number;
  distance: number;
  rating: number;
  image: string;
}

interface MapViewProps {
  vendors: Vendor[];
  userLocation: { lat: number; lng: number };
  onVendorClick: (vendorId: string) => void;
}

const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as
  | string
  | undefined;

export function MapView({ vendors, userLocation, onVendorClick }: MapViewProps) {
  const { language } = useLanguage();
  const mapRef = useRef<HTMLDivElement>(null);
  const [useGoogleMaps, setUseGoogleMaps] = useState(Boolean(googleMapsApiKey));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mapRef.current || !useGoogleMaps) {
      setLoading(false);
      return;
    }

    if (!googleMapsApiKey) {
      setUseGoogleMaps(false);
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const initMap = async () => {
      try {
        setOptions({
          apiKey: googleMapsApiKey,
          version: "weekly",
        });

        const { Map } = (await importLibrary("maps")) as google.maps.MapsLibrary;

        if (!mapRef.current || isCancelled) {
          return;
        }

        const googleMap = new Map(mapRef.current, {
          center: userLocation,
          zoom: 15,
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
          styles: [
            {
              featureType: "poi",
              elementType: "labels",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        new google.maps.Marker({
          position: userLocation,
          map: googleMap,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: "#4285F4",
            fillOpacity: 1,
            strokeColor: "#ffffff",
            strokeWeight: 2,
          },
          title: language === "en" ? "Your Location" : "Your Location",
        });

        vendors.forEach((vendor) => {
          const marker = new google.maps.Marker({
            position: { lat: vendor.latitude, lng: vendor.longitude },
            map: googleMap,
            icon: {
              url:
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(
                  '<svg width="36" height="48" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8z" fill="#FF8C42"/><circle cx="12" cy="8" r="3" fill="white"/></svg>',
                ),
              scaledSize: new google.maps.Size(36, 48),
              anchor: new google.maps.Point(18, 48),
            },
            title: language === "hi" && vendor.nameHi ? vendor.nameHi : vendor.name,
          });

          marker.addListener("click", () => {
            onVendorClick(vendor.id);
          });
        });

        if (!isCancelled) {
          setLoading(false);
        }
      } catch (error) {
        console.error("Google Maps failed to load, using simple map.", error);
        if (!isCancelled) {
          setUseGoogleMaps(false);
          setLoading(false);
        }
      }
    };

    initMap();

    return () => {
      isCancelled = true;
    };
  }, [vendors, userLocation, onVendorClick, language, useGoogleMaps]);

  if (!useGoogleMaps) {
    return (
      <div className="relative h-[calc(100vh-220px)] bg-[var(--bg-secondary)] rounded-2xl overflow-hidden m-4">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)]">
          <div className="absolute inset-0 opacity-10">
            <div
              className="h-full w-full"
              style={{
                backgroundImage:
                  "linear-gradient(var(--border-primary) 1px, transparent 1px), linear-gradient(90deg, var(--border-primary) 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
          </div>
        </div>

        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-[var(--bg-primary)] rounded-xl p-3 shadow-lg border border-[var(--border-primary)] flex items-center gap-2 z-30">
          <AlertCircle size={18} className="text-[var(--brand-orange)]" />
          <span className="text-sm text-[var(--text-secondary)]">
            Add `VITE_GOOGLE_MAPS_API_KEY` for full map view
          </span>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <div className="relative">
            <div className="absolute inset-0 w-8 h-8 bg-blue-500/30 rounded-full pulse-ring" />
            <div className="relative w-8 h-8 bg-blue-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>
        </div>

        {vendors.slice(0, 8).map((vendor, index) => {
          const angle = (index / 8) * 2 * Math.PI;
          const radius = 100 + Math.random() * 80;
          const x = 50 + radius * Math.cos(angle);
          const y = 50 + radius * Math.sin(angle);
          const displayName =
            language === "hi" && vendor.nameHi ? vendor.nameHi : vendor.name;

          return (
            <button
              key={vendor.id}
              onClick={() => onVendorClick(vendor.id)}
              className="absolute z-20 transform -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform"
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
            >
              <div className="relative">
                <MapPin
                  size={36}
                  className="text-[var(--brand-orange)] fill-[var(--brand-orange)] drop-shadow-lg"
                />
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[var(--bg-primary)] px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity shadow-lg border border-[var(--border-primary)]">
                  {displayName}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="relative h-[calc(100vh-220px)] m-4">
      {loading && (
        <div className="absolute inset-0 bg-[var(--bg-secondary)] rounded-2xl flex items-center justify-center z-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-orange)] mx-auto mb-4" />
            <p className="text-[var(--text-secondary)]">Loading map...</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full rounded-2xl overflow-hidden shadow-lg" />
    </div>
  );
}