import {
  Download,
  ExternalLink,
  FileText,
  FolderOpen,
  ImageIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getPromotionAdditionalAssets,
  getPromotionAssetUrl,
  getPromotionDocumentAssets,
  promotionAssetKindLabels,
  type PromotionAssetPresentation,
} from "@/lib/promotions/asset-presentation";

export function PromotionDocuments({
  assets,
}: {
  assets: PromotionAssetPresentation[];
}) {
  const documents = getPromotionDocumentAssets(assets);
  const additionalAssets = getPromotionAdditionalAssets(assets);

  if (!documents.length && !additionalAssets.length) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{documents.length ? "Documentos" : "Material adicional"}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {documents.map((asset) => (
          <MaterialRow key={asset.id} asset={asset} />
        ))}
        {additionalAssets.length ? (
          <div className="flex flex-col gap-3 border-t border-border pt-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <FolderOpen className="size-4" /> Material adicional
            </div>
            {additionalAssets.map((asset) => (
              <MaterialRow key={asset.id} asset={asset} />
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function MaterialRow({ asset }: { asset: PromotionAssetPresentation }) {
  const directUrl = getPromotionAssetUrl(asset.id);
  const MaterialIcon = asset.mimeType.startsWith("image/") ? ImageIcon : FileText;

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center">
      <MaterialIcon className="size-5 shrink-0 text-muted-foreground" />
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{asset.displayName}</p>
        <Badge variant="outline" className="mt-1">
          {promotionAssetKindLabels[asset.kind]}
        </Badge>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild size="sm" variant="outline">
          <a href={directUrl} target="_blank" rel="noreferrer">
            <ExternalLink /> Ver
          </a>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <a href={getPromotionAssetUrl(asset.id, true)}>
            <Download /> Descargar
          </a>
        </Button>
      </div>
    </article>
  );
}
