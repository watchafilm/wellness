
"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { Participant } from "@/lib/data"

interface ParticipantSearchProps {
    participants: Participant[];
    onSelect: (participantId: string) => void;
    value: string;
    id?: string;
}

export function ParticipantSearch({ participants, onSelect, value, id }: ParticipantSearchProps) {
  const [open, setOpen] = React.useState(false)

  const participantMap = React.useMemo(() => 
    new Map(participants.map(p => [p.id, p.name])), 
    [participants]
  );
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-9"
        >
          <span className="truncate">
          {value
            ? `${value} - ${participantMap.get(value) || 'Unknown Participant'}`
            : "Select participant..."}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <CommandInput placeholder="Search participant by ID or name..." />
          <CommandList>
            <CommandEmpty>No participant found.</CommandEmpty>
            <CommandGroup>
              {participants.map((participant) => (
                <CommandItem
                  key={participant.id}
                  value={`${participant.id} ${participant.name}`}
                  onSelect={(currentValue) => {
                    // currentValue is the `value` prop of CommandItem
                    const selectedId = currentValue.split(' ')[0].toUpperCase();
                    onSelect(selectedId === value ? "" : selectedId)
                    setOpen(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === participant.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {participant.id} - {participant.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
