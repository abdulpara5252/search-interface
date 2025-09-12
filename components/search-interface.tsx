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
import data from "../Data.json"

// Import mock data from JSON file
const mockResults = data

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

type ChatResult = {
  id: number
  name: string
  participants: string[]
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  type: string
}

type ListResult = {
  id: number
  name: string
  description: string
  itemCount: number
  lastModified: string
  type: string
  owner: string
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
  const [tooltipOpen, setTooltipOpen] = useState<string | null>(null)
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

  const filteredChats = mockResults.chats.filter((chat) => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLists = mockResults.lists.filter((list) =>
    list.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    list.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const allResults = [...filteredPeople, ...filteredFiles, ...filteredChats, ...filteredLists]

  const getResultCounts = () => {
    return {
      all: allResults.length,
      files: filteredFiles.length,
      people: filteredPeople.length,
      chats: filteredChats.length,
      lists: filteredLists.length,
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
        return <Folder className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
      case "image":
        return <ImageIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
      case "video":
        return <Play className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
      default:
        return <Paperclip className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
    }
  }

  const clearSearch = () => {
    setSearchQuery("")
    setShowFilters(false)
    setHoveredItem(null)
    setCopiedItem(null)
    setTooltipOpen(null)
  }

  const handleCopyLink = (item: any) => {
    navigator.clipboard.writeText(`https://example.com/item/${item.id}`)
    setCopiedItem(item.id.toString())
    setTooltipOpen(item.id.toString())
    
    setTimeout(() => {
      setTooltipOpen(null)
      // Small delay to ensure tooltip closes before resetting copiedItem
      setTimeout(() => {
        setCopiedItem(null)
      }, 100)
    }, 2000)
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
  
    let resultsToShow: (PersonResult | FileResult | ChatResult | ListResult)[] = []
  
    if (activeTab === "all") {
      resultsToShow = [...filteredPeople, ...filteredFiles, ...filteredChats, ...filteredLists] as (PersonResult | FileResult | ChatResult | ListResult)[]
    } else if (activeTab === "people") {
      resultsToShow = filteredPeople
    } else if (activeTab === "files") {
      resultsToShow = filteredFiles
    } else if (activeTab === "chats") {
      resultsToShow = filteredChats as ChatResult[]
    } else if (activeTab === "lists") {
      resultsToShow = filteredLists as ListResult[]
    }
  
    return (
      <motion.div
        className="space-y-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatePresence>
          {resultsToShow.map((result, index) => {
            const itemKey = `${result.id}-${"status" in result ? "person" : "lastMessage" in result ? "chat" : "itemCount" in result ? "list" : "file"}`
            return (
              <motion.div
                key={itemKey}
                className="relative flex items-center space-x-2 sm:space-x-3 hover:bg-gray-50 p-2 sm:p-3 rounded-lg cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onMouseEnter={() => setHoveredItem(itemKey)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                {"status" in result ? (
                  // Person result
                  <>
                    <div className="relative">
                      <Avatar className="w-8 h-8 sm:w-10 sm:h-10">
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
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{highlightText(result.name, searchQuery)}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">{result.status}</div>
                    </div>
  
                    <AnimatePresence>
                      {hoveredItem === itemKey && (
                        <motion.div
                          className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2 z-10"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Tooltip 
                            open={tooltipOpen === result.id.toString() ? true : undefined}
                            onOpenChange={(open) => {
                              if (!open && copiedItem !== result.id.toString()) {
                                setTooltipOpen(null)
                              }
                            }}
                          >
                            <TooltipTrigger asChild>
                              <div
                                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                                onClick={() => handleCopyLink(result)}
                              >
                                <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={6}
                            >
                              {copiedItem === result.id.toString() ? "✓ Link copied!" : "Copy link"}
                            </TooltipContent>
                          </Tooltip>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 sm:h-7 px-1 sm:px-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded flex items-center space-x-1"
                            onClick={() => window.open(`/item/${result.id}`, "_blank")}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="hidden sm:inline">New Tab</span>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : "lastMessage" in result ? (
                  // Chat result
                  <>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {highlightText(result.name, searchQuery)}
                        {"unreadCount" in result && result.unreadCount > 0 && (
                          <span className="ml-1 sm:ml-2 inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {result.unreadCount}
                          </span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">
                        {"lastMessage" in result && result.lastMessage} • {"lastMessageTime" in result && result.lastMessageTime}
                      </div>
                    </div>

                    <AnimatePresence>
                      {hoveredItem === itemKey && (
                        <motion.div
                          className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2 z-10"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Tooltip 
                            open={tooltipOpen === result.id.toString() ? true : undefined}
                            onOpenChange={(open) => {
                              if (!open && copiedItem !== result.id.toString()) {
                                setTooltipOpen(null)
                              }
                            }}
                          >
                            <TooltipTrigger asChild>
                              <div
                                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                                onClick={() => handleCopyLink(result)}
                              >
                                <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={6}
                            >
                              {copiedItem === result.id.toString() ? "Link copied!" : "Copy link"}
                            </TooltipContent>
                          </Tooltip>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 sm:h-7 px-1 sm:px-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded flex items-center space-x-1"
                            onClick={() => window.open(`/chat/${result.id}`, "_blank")}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="hidden sm:inline">Open Chat</span>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : "type" in result && "location" in result ? (
                  // File result
                  <>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                      {getFileIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {highlightText(result.name, searchQuery)}
                        {result.type === "folder" && result.fileCount && (
                          <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500">{result.fileCount} Files</span>
                        )}
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">
                        in {result.location} • {result.lastModified}
                      </div>
                    </div>
  
                    <AnimatePresence>
                      {hoveredItem === itemKey && (
                        <motion.div
                          className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2 z-10"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Tooltip 
                            open={tooltipOpen === result.id.toString() ? true : undefined}
                            onOpenChange={(open) => {
                              if (!open && copiedItem !== result.id.toString()) {
                                setTooltipOpen(null)
                              }
                            }}
                          >
                            <TooltipTrigger asChild>
                              <div
                                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                                onClick={() => handleCopyLink(result)}
                              >
                                <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={6}
                            >
                              {copiedItem === result.id.toString() ? "Link copied!" : "Copy link"}
                            </TooltipContent>
                          </Tooltip>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 sm:h-7 px-1 sm:px-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded flex items-center space-x-1"
                            onClick={() => window.open(`/item/${result.id}`, "_blank")}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="hidden sm:inline">New Tab</span>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : "itemCount" in result ? (
                  // List result
                  <>
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <List className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {highlightText(result.name, searchQuery)}
                        <span className="ml-1 sm:ml-2 text-xs sm:text-sm text-gray-500">{"itemCount" in result && result.itemCount} items</span>
                      </div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">
                        {"description" in result && result.description} • {"lastModified" in result && result.lastModified}
                      </div>
                    </div>

                    <AnimatePresence>
                      {hoveredItem === itemKey && (
                        <motion.div
                          className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1 sm:space-x-2 z-10"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Tooltip 
                            open={tooltipOpen === result.id.toString() ? true : undefined}
                            onOpenChange={(open) => {
                              if (!open && copiedItem !== result.id.toString()) {
                                setTooltipOpen(null)
                              }
                            }}
                          >
                            <TooltipTrigger asChild>
                              <div
                                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center cursor-pointer transition-colors"
                                onClick={() => handleCopyLink(result)}
                              >
                                <LinkIcon className="w-3 h-3 sm:w-4 sm:h-4 text-gray-700" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="top"
                              sideOffset={6}
                            >
                              {copiedItem === result.id.toString() ? "Link copied!" : "Copy link"}
                            </TooltipContent>
                          </Tooltip>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 sm:h-7 px-1 sm:px-2 text-xs text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded flex items-center space-x-1"
                            onClick={() => window.open(`/list/${result.id}`, "_blank")}
                          >
                            <ExternalLink className="w-3 h-3" />
                            <span className="hidden sm:inline">Open List</span>
                          </Button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : null}
              </motion.div>
            )
          })}
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
        className="p-4 sm:p-6"
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
              className="pl-10 pr-20 sm:pr-28 py-2 sm:py-3 text-base sm:text-lg border-0 bg-white focus:bg-white focus:ring-0 focus:outline-none focus:border-0 focus:shadow-none rounded-xl"
            />
            <AnimatePresence>
              {isCollapsed && !searchQuery && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 flex items-center space-x-1 sm:space-x-2"
                >
                  <div className="w-6 h-6 bg-white rounded border border-gray-200 flex items-center justify-center shadow-sm">
                    <span className="text-sm font-medium text-gray-700">S</span>
                  </div>
                  <span className="text-xs sm:text-sm text-gray-500 hidden sm:inline">quick access</span>
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
              className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-100"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <motion.div className="flex space-x-4 sm:space-x-8 overflow-x-auto" layout>
                  <AnimatePresence>
                    {getVisibleTabs().map((tab) => {
                      const Icon = tab.icon
                      return (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key)}
                          className={`flex items-center space-x-1 sm:space-x-2 pb-2 border-b-2 transition-colors whitespace-nowrap ${
                            activeTab === tab.key
                              ? "border-black text-black font-medium"
                              : "border-transparent text-gray-500 hover:text-gray-700"
                          }`}
                        >
                          {Icon && <Icon className="w-3 h-3 sm:w-4 sm:h-4" />}
                          <span className="text-sm sm:text-base">{tab.label}</span>
                          <span className="text-xs sm:text-sm">{tab.count}</span>
                        </button>
                      )
                    })}
                  </AnimatePresence>
                </motion.div>

                <DropdownMenu open={showFilters} onOpenChange={setShowFilters}>
                  <DropdownMenuTrigger asChild>
                    <div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="relative z-50"
                      >
                        <motion.div animate={{ rotate: showFilters ? 180 : 0 }} transition={{ duration: 0.2 }}>
                          <Settings className="w-5 h-5 text-gray-500" />
                        </motion.div>
                      </Button>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 p-4 z-50">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-4">
                        <motion.div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Paperclip className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">Files</span>
                          </div>
                          <Switch
                            checked={filters.files}
                            onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, files: checked }))}
                          />
                        </motion.div>
                        <motion.div className="flex items-center justify-between" >
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">People</span>
                          </div>
                          <Switch
                            checked={filters.people}
                            onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, people: checked }))}
                          />
                        </motion.div>
                        <motion.div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="w-4 h-4 text-gray-500" />
                            <span className="text-sm">Chats</span>
                          </div>
                          <Switch
                            checked={filters.chats}
                            onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, chats: checked }))}
                          />
                        </motion.div>
                        <motion.div className="flex items-center justify-between">
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
              className="p-4 sm:p-6 min-h-[300px] sm:min-h-[400px]"
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