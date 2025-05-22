import type React from "react"
import type { ComponentCell as ComponentCellType } from "@/types"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface ComponentCellProps {
  cell: ComponentCellType
}

// Map of available components that can be rendered
const AVAILABLE_COMPONENTS: Record<string, React.FC<any>> = {
  Alert: ({ title, description, ...props }) => (
    <Alert {...props}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {description && <AlertDescription>{description}</AlertDescription>}
    </Alert>
  ),
  Card: ({ title, description, content, footer, ...props }) => (
    <Card {...props}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && <CardDescription>{description}</CardDescription>}
        </CardHeader>
      )}
      {content && <CardContent>{content}</CardContent>}
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  ),
}

export function ComponentCell({ cell }: ComponentCellProps) {
  const ComponentToRender = AVAILABLE_COMPONENTS[cell.content.name]

  if (!ComponentToRender) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Component Error</AlertTitle>
        <AlertDescription>Component "{cell.content.name}" is not available.</AlertDescription>
      </Alert>
    )
  }

  return <ComponentToRender {...cell.content.props} />
}
