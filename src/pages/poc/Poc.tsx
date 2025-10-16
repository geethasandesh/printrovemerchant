import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@shopify/polaris";
import { useFetch } from "../../hooks/useFetch";
import { useProductGridStore ,GridLine} from "../../store/useProductCustomizerAssetStore";

interface ProductGridResponse {
  data: GridLine[];
}

export function ButtonGrid() {
  const navigate = useNavigate();
  const { data } = useFetch(`/product-grids`, 0);
  const productGridData = (data as ProductGridResponse | undefined)?.data ?? [];

  const setProductGrid = useProductGridStore((state) => state.setProductGrid);

  // Populate the Zustand store with fetched grid data
  useEffect(() => {
    if (productGridData.length > 0) {
      productGridData.forEach((item) => {
        const {
          productType,
          ...rest
        } = item;

        setProductGrid(productType, rest);
      });
    }
  }, [productGridData, setProductGrid]);

  const buttonLabels: { [key: string]: string } = {
    toddlers: "Toddler",
    kids: "Kids",
    women: "Women",
    oversize: "Oversize T-Shirt",
    unisex_round_long_sleeve: "Unisex Round Long Sleeve",
    unisex_round: "Unisex Round",
    women_rounded: "Women Rounded",
    sweatshirt: "Sweat Shirt",
    polo_unisex: "Polo Unisex",
    bomber_jacket: "Bomber Jacket",
    crop_hoodie: "Crop Hoodie",
  };

  const productTypes = Object.keys(buttonLabels);

  const idMap: Record<string, string> = {};
  productGridData.forEach((item) => {
    idMap[item.productType] = item._id;
  });

  const handleButtonClick = (id: string) => {
    navigate(`/product-customizer/${id}`);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="grid grid-cols-3 gap-4 w-fit mx-auto p-4">
        {productTypes.map((type) =>
          idMap[type] ? (
            <Button
              key={type}
              onClick={() => handleButtonClick(idMap[type])}
              size="slim"
            >
              {buttonLabels[type]}
            </Button>
          ) : null
        )}
      </div>
    </div>
  );
}
