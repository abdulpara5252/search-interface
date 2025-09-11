"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Settings,
  Paperclip,
  Users,
  MessageSquare,
  List,
  Folder,
  ImageIcon,
  Play,
  ExternalLink,
  Link as LinkIcon,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { motion, AnimatePresence } from "framer-motion"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

// Mock data for search results
const mockResults: { people: PersonResult[]; files: FileResult[] } = {
  people: [
    {
      id: 1,
      name: "Randall Johnsson",
      status: "Active now",
      avatar: "/professional-man.png",
      isActive: true,
    },
    {
      id: 2,
      name: "Kristinge Karand",
      status: "Active 2d ago",
      avatar: "/professional-woman.png",
      isActive: false,
    },
    {
      id: 3,
      name: "Caroline Dribsson",
      status: "Unactivated",
      avatar: "/man-with-beard.png",
      isActive: false,
    },
    {
      id: 4,
      name: "Adam Cadribean",
      status: "Active 1w ago",
      avatar: "/young-man-contemplative.png",
      isActive: false,
    },
    {
      id: 5,
      name: "Margareth Cendribgssen",
      status: "Active 1w ago",
      avatar: "/elderly-woman-knitting.png",
      isActive: false,
    },
  ],
  files: [
    {
      id: 1,
      name: "Random Michal Folder",
      type: "folder",
      location: "Photos",
      fileCount: 12,
      lastModified: "Edited 12m ago",
    },
    {
      id: 2,
      name: "creative_file_frandkies.jpg",
      type: "image",
      location: "Photos/Assets",
      lastModified: "Edited 12m ago",
    },
    {
      id: 3,
      name: "files_krande_michelle.avi",
      type: "video",
      location: "Videos",
      lastModified: "Added 12m ago",
    },
    {
      id: 4,
      name: "final_dribbble_presentation.jpg",
      type: "image",
      location: "Presentations",
      lastModified: "Edited 1w ago",
    },
    {
      id: 5,
      name: "dribbble_animation.avi",
      type: "video",
      location: "Videos",
      lastModified: "Added 1y ago",
    },
    {
      id: 6,
      name: "Dribbble Folder",
      type: "folder",
      location: "Projects",
      fileCount: 12,
      lastModified: "Edited 2m ago",
    },
  ],
}

type PersonResult = {
  id: number
  name: string
  status: string
  avatar: string
  isActive: boolean
}

type FileResult = {
  id: number
  name: string
  type: string
  location: string
  lastModified: string
  fileCount?: number
}

const highlightText = (text: string, query: string) => {
  if (!query) return text
  const parts = text.split(new RegExp(`(${query})`, "gi"))
  return parts.map((part, index) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <span key={index} className="bg-yellow-200 text-yellow-900">
        {part}
      </span>
    ) : (
      part
    ),
  )
}

export default function SearchInterface() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [showFilters, setShowFilters] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [copiedItem, setCopiedItem] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    files: true,
    people: true,
    chats: false,
    lists: false,
  })

  useEffect(() => {
    if (searchQuery) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 800)
      return () => clearTimeout(timer)
    } else {
      setIsLoading(false)
    }
  }, [searchQuery])

  const filteredPeople = mockResults.people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const filteredFiles = mockResults.files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const allResults = [...filteredPeople, ...filteredFiles]

  const getResultCounts = () => {
    return {
      all: allResults.length,
      files: filteredFiles.length,
      people: filteredPeople.length,
      chats: 0, // Mock data for chats
      lists: 0, // Mock data for lists
    }
  }

  const counts = getResultCounts()

  type TabDef = { key: string; label: string; icon?: React.ElementType | null; count: number }

  const getVisibleTabs = () => {
    const tabs: TabDef[] = [{ key: "all", label: "All", icon: null, count: counts.all }]

    if (filters.files) {
      tabs.push({ key: "files", label: "Files", icon: Paperclip, count: counts.files })
    }

    if (filters.people) {
      tabs.push({ key: "people", label: "People", icon: Users, count: counts.people })
    }

    if (filters.chats) {
      tabs.push({ key: "chats", label: "Chats", icon: MessageSquare, count: counts.chats })
    }

    if (filters.lists) {
      tabs.push({ key: "lists", label: "Lists", icon: List, count: counts.lists })
    }

    return tabs
  }

  const getFileIcon = (type: string) => {
    switch (type) {
      case "folder":
        return <Folder className="w-5 h-5 text-gray-500" />
      case "image":
        return <ImageIcon className="w-5 h-5 text-gray-500" />
      case "video":
        return <Play className="w-5 h-5 text-gray-500" />
      default:
        return <Paperclip className="w-5 h-5 text-gray-500" />
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowFilters(false)
    setHoveredItem(null)
    setCopiedItem(null)
  }

  const handleCopyLink = (item: any) => {
    navigator.clipboard.writeText(`https://example.com/item/${item.id}`)
    setCopiedItem(item.id.toString())
    setTimeout(() => setCopiedItem(null), 2000)
  }

  const renderResults = () => {
    if (!searchQuery) {
      return (
        <motion.div
          className="space-y-4 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )
    }

    if (isLoading) {
      return (
        <motion.div className="space-y-4 mt-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="flex items-center space-x-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.3 }}
            >
              <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )
    }

    let resultsToShow: (PersonResult | FileResult)[] = []

    if (activeTab === "all") {
      resultsToShow = [...filteredPeople, ...filteredFiles]
    } else if (activeTab === "people") {
      resultsToShow = filteredPeople
    } else if (activeTab === "files") {
      resultsToShow = filteredFiles
    }

    return (
      <motion.div
        className="space-y-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {resultsToShow.map((result, index) => (
            <motion.div
              key={`${result.id}-${"status" in result ? "person" : "file"}`}
              className="relative flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg cursor-pointer group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onMouseEnter={() => setHoveredItem(`${result.id}-${"status" in result ? "person" : "file"}`)}
              onMouseLeave={() => setHoveredItem(null)}
            >
              {"status" in result ? (
                // Person result
                <>
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={result.avatar || "/placeholder.svg"} alt={result.name} />
                      <AvatarFallback>
                        {result.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {result.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                    {result.status === "Unactivated" && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
                    )}
                    {result.status.includes("ago") && !result.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-yellow-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{highlightText(result.name, searchQuery)}</div>
                    <div className="text-sm text-gray-500">{result.status}</div>
                  </div>

                  <AnimatePresence>
                    {hoveredItem === `${result.id}-person` && (
                      <motion.div
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {copiedItem === result.id.toString() ? (
                          <motion.div
                            className="bg-black text-white px-3 py-1 rounded text-xs flex items-center space-x-1"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span>✓</span>
                            <span>Link copied!</span>
                          </motion.div>
                        ) : (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100"
                                  onClick={() => handleCopyLink(result)}
                                >
                                  <LinkIcon className="w-4 h-4 text-gray-700" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent sideOffset={6} className="bg-black text-white">Copy link</TooltipContent>
                            </Tooltip>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded flex items-center space-x-1"
                              onClick={() => window.open(`/item/${result.id}`, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>New Tab</span>
                            </Button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                // File result
                <>
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getFileIcon(result.type)}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">
                      {highlightText(result.name, searchQuery)}
                      {result.type === "folder" && result.fileCount && (
                        <span className="ml-2 text-sm text-gray-500">{result.fileCount} Files</span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      in {result.location} • {result.lastModified}
                    </div>
                  </div>

                  <AnimatePresence>
                    {hoveredItem === `${result.id}-file` && (
                      <motion.div
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {copiedItem === result.id.toString() ? (
                          <motion.div
                            className="bg-black text-white px-3 py-1 rounded text-xs flex items-center space-x-1"
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.2 }}
                          >
                            <span>✓</span>
                            <span>Link copied!</span>
                          </motion.div>
                        ) : (
                          <>
                            <Tooltip>
                              <TooltipTrigger asChild>
                            <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100"
                              onClick={() => handleCopyLink(result)}
                            >
                                  <LinkIcon className="w-4 h-4 text-gray-700" />
                            </Button>
                              </TooltipTrigger>
                              <TooltipContent sideOffset={6} className="bg-black text-white">Copy link</TooltipContent>
                            </Tooltip>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 px-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded flex items-center space-x-1"
                              onClick={() => window.open(`/item/${result.id}`, "_blank")}
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>New Tab</span>
                            </Button>
                          </>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    )
  }

  const isCollapsed = !searchQuery

  return (
    <motion.div
      className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden relative"
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{
        scale: 1,
        opacity: 1,
        height: isCollapsed ? "auto" : "auto",
      }}
      transition={{ duration: 0.3 }}
      layout
    >
      {/* Search Header */}
      <motion.div
        className="p-6"
        layout
        animate={{
          borderBottom: isCollapsed ? "none" : "1px solid rgb(243 244 246)",
        }}
      >
        <div className="flex items-center space-x-4 relative">
          <motion.div
            className="flex-1 relative"
            animate={{ scale: searchQuery ? 1.02 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
              animate={{ rotate: isLoading ? 360 : 0 }}
              transition={{ duration: 0.5, repeat: isLoading ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
              ) : (
                <Search className="text-gray-400 w-5 h-5" />
              )}
            </motion.div>
            <Input
              type="text"
              placeholder="Searching is easier"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-28 py-3 text-lg border-0 bg-white focus:bg-white focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none rounded-xl"
            />
            <AnimatePresence>
              {isCollapsed && !searchQuery && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 flex items-center space-x-2"
                >
                  <div className="w-6 h-6 bg-white rounded border border-gray-200 flex items-center justify-center shadow-sm">
                    <span className="text-sm font-medium text-gray-700">S</span>
                  </div>
                  <span className="text-sm text-gray-500">quick access</span>
                </motion.div>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {searchQuery && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="h-8 px-2 text-black hover:text-gray-700 hover:bg-transparent underline text-sm font-normal"
                  >
                    Clear
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {false && isCollapsed}
        </div>
      </motion.div>

      <AnimatePresence>
        {!isCollapsed && (
          <>
            {/* Tabs and Settings */}
            <motion.div
              className="px-6 py-4 border-b border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <motion.div className="flex space-x-8" layout>
                  <AnimatePresence>
                    {getVisibleTabs().map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`flex items-center space-x-2 pb-2 border-b-2 transition-colors ${
                            activeTab === tab.key
                              ? "border-black text-black font-medium"
                              : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {Icon && <Icon className="w-4 h-4" />}
                          <span>{tab.label}</span>
                          <span className="text-sm">{tab.count}</span>
                        </button>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>

                <DropdownMenu onOpenChange={setShowFilters}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <motion.div animate={{ rotate: showFilters ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <Settings className="w-5 h-5 text-gray-500" />
                      </motion.div>
                    </Button>
                  </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 p-4" asChild>
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="space-y-4">
                            <motion.div className="flex items-center justify-between" whileHover={{ x: 2 }}>
                              <div className="flex items-center space-x-2">
                                <Paperclip className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Files</span>
                              </div>
                              <Switch
                                checked={filters.files}
                                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, files: checked }))}
                              />
                            </motion.div>
                            <motion.div className="flex items-center justify-between" whileHover={{ x: 2 }}>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">People</span>
                              </div>
                              <Switch
                                checked={filters.people}
                                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, people: checked }))}
                              />
                            </motion.div>
                            <motion.div className="flex items-center justify-between" whileHover={{ x: 2 }}>
                              <div className="flex items-center space-x-2">
                                <MessageSquare className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Chats</span>
                              </div>
                              <Switch
                                checked={filters.chats}
                                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, chats: checked }))}
                              />
                            </motion.div>
                            <motion.div className="flex items-center justify-between" whileHover={{ x: 2 }}>
                              <div className="flex items-center space-x-2">
                                <List className="w-4 h-4 text-gray-500" />
                                <span className="text-sm">Lists</span>
                              </div>
                              <Switch
                                checked={filters.lists}
                                onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, lists: checked }))}
                              />
                            </motion.div>
                          </div>
                        </motion.div>
                      </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>

            {/* Results */}
            <motion.div
              className="p-6 min-h-[400px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderResults()}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
