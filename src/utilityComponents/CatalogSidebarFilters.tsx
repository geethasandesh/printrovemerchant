import { useState } from 'react';
import { Collapsible, Checkbox, Text, Button, InlineStack, BlockStack, Box } from '@shopify/polaris';

export default function CatalogSidebarFilters() {
  const [openMaterial, setOpenMaterial] = useState(true);
  const [openColor, setOpenColor] = useState(false);
  const [openSize, setOpenSize] = useState(false);
  const [openMen, setOpenMen] = useState(true);
  const [openWomen, setOpenWomen] = useState(false);
  const [openKids, setOpenKids] = useState(false);
  const [openAccessories, setOpenAccessories] = useState(false);

  const toggle = (setter: any) => setter((open: any) => !open);

  return (
    <Box background='bg'>
      {/* Material Filter */}
      <div style={{ padding: '8px 16px' }}>
        <BlockStack gap={"200"}>
          <Button
            onClick={() => toggle(setOpenMaterial)}
            disclosure={openMaterial ? 'up' : 'down'}
            variant='monochromePlain'
          >
            Material
          </Button>
          <Collapsible id='material-coll' open={openMaterial} transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
            expandOnPrint>
            <BlockStack gap={"200"}>
              <Checkbox label={<InlineStack gap={"500"}>
                <Text as='p'>All</Text>
                <Text as='p'>11</Text>
              </InlineStack>} checked={false} onChange={() => { }} />
              <Checkbox label={<InlineStack gap={"500"}>
                <Text as='p'>Cotton</Text>
                <Text as='p'>1</Text>
              </InlineStack>} checked={true} onChange={() => { }} />
              <Checkbox label={<InlineStack gap={"500"}>
                <Text as='p'>Linen</Text>
                <Text as='p'>1</Text>
              </InlineStack>} checked={false} onChange={() => { }} />
              <Checkbox label={<InlineStack gap={"500"}>
                <Text as='p'>Silk</Text>
                <Text as='p'>1</Text>
              </InlineStack>} checked={false} onChange={() => { }} />
              <Checkbox label={<InlineStack gap={"500"}>
                <Text as='p'>Wool</Text>
                <Text as='p'>1</Text>
              </InlineStack>} checked={false} onChange={() => { }} />
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </div>

      {/* Color Filter */}
      <div style={{ padding: '8px 16px' }}>
        <BlockStack gap={"200"}>
          <Button
            onClick={() => toggle(setOpenColor)}
            disclosure={openColor ? 'up' : 'down'}
            variant='monochromePlain'
          >
            Color
          </Button>
          <Collapsible id='333' open={openColor} transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
            expandOnPrint>
            <div style={{ marginTop: 8 }}>
              {/* Add color options here */}
            </div>
          </Collapsible>
        </BlockStack>
      </div>

      {/* Size Filter */}
      <div style={{ padding: '8px 16px' }}>
        <BlockStack gap={"200"}>
          <Button
            onClick={() => toggle(setOpenSize)}
            disclosure={openSize ? 'up' : 'down'}
            variant='monochromePlain'
          >
            Size
          </Button>
          <Collapsible id='33' open={openSize} transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
            expandOnPrint>
            <div style={{ marginTop: 8 }}>
              {/* Add size options here */}
            </div>
          </Collapsible>
        </BlockStack>
      </div>

      {/* Men's Clothing */}
      <div style={{ padding: '8px 16px' }}>
        <BlockStack gap={"200"}>
          <Button
            onClick={() => toggle(setOpenMen)}
            disclosure={openMen ? 'up' : 'down'}
            variant='monochromePlain'
          >
            Men's Clothing
          </Button>
          <Collapsible id='men-Clothing-coll' open={openMen} transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
            expandOnPrint>
            <BlockStack gap={"200"}>
              <InlineStack gap={"300"}>
                <Text as='p' tone="subdued">All</Text>
                <Text as='p' tone="subdued">20</Text>
              </InlineStack>
              <InlineStack gap={"300"}>
                <Text as='p'>T-shirts</Text>
                <Text as='p' tone="subdued">4</Text>
              </InlineStack>
              <InlineStack gap={"300"}>
                <Text as='p' tone="subdued">Shirts</Text>
                <Text as='p' tone="subdued">8</Text>
              </InlineStack>
              <InlineStack gap={"300"}>
                <Text as='p' tone="subdued">Trousers</Text>
                <Text as='p' tone="subdued">10</Text>
              </InlineStack>
              <InlineStack gap={"300"}>
                <Text as='p' tone="subdued">Shorts</Text>
                <Text as='p' tone="subdued">5</Text>
              </InlineStack>
            </BlockStack>
          </Collapsible>
        </BlockStack>
      </div>

      {/* Women's Clothing */}
      <div style={{ padding: '8px 16px' }}>
        <BlockStack gap={"200"}>
          <Button
            onClick={() => toggle(setOpenWomen)}
            disclosure={openWomen ? 'up' : 'down'}
            variant='monochromePlain'
          >
            Women's Clothing
          </Button>
          <Collapsible open={openWomen} id='women-Clothing-coll' transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
            expandOnPrint>
            <div style={{ marginTop: 8 }}>
              {/* Add items here */}
            </div>
          </Collapsible>
        </BlockStack>
      </div>

      {/* Kid's Clothing */}
      <div style={{ padding: '8px 16px' }}>
        <BlockStack gap={"200"}>
          <Button
            onClick={() => toggle(setOpenKids)}
            disclosure={openKids ? 'up' : 'down'}
            variant='monochromePlain'
          >
            Kid's Clothing
          </Button>
          <Collapsible id='Kid-Clothing-coll' open={openKids} transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
            expandOnPrint>
            <div style={{ marginTop: 8 }}>
              {/* Add items here */}
            </div>
          </Collapsible>
        </BlockStack>
      </div>

      {/* Accessories */}
      <div style={{ padding: '8px 16px' }}>
        <BlockStack gap={"200"}>
          <Button
            onClick={() => toggle(setOpenAccessories)}
            disclosure={openAccessories ? 'up' : 'down'}
            variant='monochromePlain'
          >
            Accessories
          </Button>
          <Collapsible id='accessories-coll' open={openAccessories} transition={{ duration: '500ms', timingFunction: 'ease-in-out' }}
            expandOnPrint>
            <div style={{ marginTop: 8 }}>
              {/* Add items here */}
            </div>
          </Collapsible>
        </BlockStack>
      </div>
    </Box>
  );
}
