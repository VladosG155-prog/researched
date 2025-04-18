"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, X } from "lucide-react"
import Image from "next/image"

interface Country {
  name: string
  icon?: string
}

interface CountryPopupProps {
  countries: Country[]
  isOpen: boolean
  onClose: () => void
  title?: string
}

export function CountryPopup({ countries, isOpen, onClose, title }: CountryPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscKey)
      // Focus search input when popup opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 100)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleEscKey)
    }
  }, [isOpen, onClose])

  // Reset search when popup closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("")
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            ref={popupRef}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#121212] rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-hidden border border-neutral-800"
          >
            <div className="flex items-center justify-between p-4 border-b border-neutral-800">
              <h3 className="text-lg font-medium">{title || `Страны (${countries.length})`}</h3>
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label="Закрыть"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 border-b border-neutral-800">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-neutral-400" />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по странам..."
                  className="w-full py-2 pl-10 pr-4 bg-transparent border border-blue-600 rounded-md text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="custom-scrollbar overflow-y-auto max-h-[50vh] p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-2 bg-neutral-800/50 rounded-md hover:bg-neutral-700/50 transition-colors"
                    >
                      {country.icon ? (
                        <div className="w-5 h-5 flex-shrink-0 overflow-hidden">
                          <Image
                            src={country.icon || "/placeholder.svg"}
                            alt={country.name}
                            width={20}
                            height={20}
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-5 h-5 bg-neutral-700 rounded-full flex-shrink-0" />
                      )}
                      <span className="text-sm">{country.name}</span>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-8 text-neutral-400">Страны не найдены</div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

