import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type PlantCategory =
  | "Bryophyta"       // Mosses
  | "Pteridophyta"    // Ferns & Horsetails
  | "Gymnosperms"     // Conifers, Cycads
  | "Monocots"        // Grasses, Orchids, Palms
  | "Dicots"          // Most flowering plants
  | "Fungi"           // Fungi (often grouped with plants)
  | "Algae"           // Algae
  | "Uncategorized";

export interface PlantImage {
  id: string;
  uri: string;              // local file URI from camera
  category: PlantCategory;
  speciesName?: string;     // optional label
  capturedAt: Date;
}

// ─────────────────────────────────────────────
// CATEGORY METADATA
// ─────────────────────────────────────────────

const CATEGORIES: {
  key: PlantCategory;
  label: string;
  commonName: string;
  color: string;
  emoji: string;
}[] = [
  { key: "Bryophyta",    label: "Bryophyta",    commonName: "Mosses & Liverworts", color: "#4a7c59", emoji: "🌿" },
  { key: "Pteridophyta", label: "Pteridophyta", commonName: "Ferns & Horsetails",  color: "#2d6a4f", emoji: "🌱" },
  { key: "Gymnosperms",  label: "Gymnosperms",  commonName: "Conifers & Cycads",   color: "#1b4332", emoji: "🌲" },
  { key: "Monocots",     label: "Monocots",     commonName: "Grasses & Orchids",   color: "#52b788", emoji: "🌸" },
  { key: "Dicots",       label: "Dicots",       commonName: "Flowering Plants",    color: "#74c69d", emoji: "🌺" },
  { key: "Fungi",        label: "Fungi",        commonName: "Mushrooms & Moulds",  color: "#b7791f", emoji: "🍄" },
  { key: "Algae",        label: "Algae",        commonName: "Algae & Seaweed",     color: "#0a9396", emoji: "🌊" },
  { key: "Uncategorized",label: "Uncategorized",commonName: "Unsorted",            color: "#6b7280", emoji: "📷" },
];

// ─────────────────────────────────────────────
// MOCK DATA  ← replace with your real source
// ─────────────────────────────────────────────

const MOCK_IMAGES: PlantImage[] = [
  { id: "1", uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/41/Sunflower_from_Silesia2.jpg/320px-Sunflower_from_Silesia2.jpg", category: "Dicots",       speciesName: "Helianthus annuus", capturedAt: new Date() },
  { id: "2", uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/24701-nature-natural-beauty.jpg/320px-24701-nature-natural-beauty.jpg", category: "Monocots",     speciesName: "Orchidaceae sp.",   capturedAt: new Date() },
  { id: "3", uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Bletilla_striata_2.jpg/320px-Bletilla_striata_2.jpg", category: "Monocots",     speciesName: "Bletilla striata",  capturedAt: new Date() },
  { id: "4", uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9f/Fern_frond.jpg/320px-Fern_frond.jpg", category: "Pteridophyta", speciesName: "Dryopteris sp.",    capturedAt: new Date() },
  { id: "5", uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/Scots_Pine_Pinus_sylvestris_Tree.jpg/320px-Scots_Pine_Pinus_sylvestris_Tree.jpg", category: "Gymnosperms",  speciesName: "Pinus sylvestris",  capturedAt: new Date() },
  { id: "6", uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Amanita_muscaria_3_vliegenzwammen_op_rij.jpg/320px-Amanita_muscaria_3_vliegenzwammen_op_rij.jpg", category: "Fungi",        speciesName: "Amanita muscaria",  capturedAt: new Date() },
];

// ─────────────────────────────────────────────
// HOOKS — swap MOCK_IMAGES for your real data
// ─────────────────────────────────────────────

function usePlantImages(): PlantImage[] {
  // TODO: replace with your actual source, e.g.:
  //   const images = useSelector(state => state.plants.images);
  //   const [images] = useMMKVObject<PlantImage[]>('plant-images');
  //   AsyncStorage.getItem('plant-images').then(...)
  return MOCK_IMAGES;
}

// ─────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────

const { width } = Dimensions.get("window");
const THUMB = (width - 48) / 3;

function CategoryPill({
  category,
  active,
  count,
  onPress,
}: {
  category: typeof CATEGORIES[0];
  active: boolean;
  count: number;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.pill,
        active && { backgroundColor: category.color, borderColor: category.color },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <Text style={styles.pillEmoji}>{category.emoji}</Text>
      <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
        {category.label}
      </Text>
      {count > 0 && (
        <View style={[styles.badge, active && styles.badgeActive]}>
          <Text style={[styles.badgeText, active && styles.badgeTextActive]}>
            {count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function ImageTile({ item }: { item: PlantImage }) {
  const [pressed, setPressed] = useState(false);
  return (
    <TouchableOpacity
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      activeOpacity={1}
      style={[styles.tile, pressed && styles.tilePressed]}
    >
      <Image source={{ uri: item.uri }} style={styles.tileImage} resizeMode="cover" />
      {item.speciesName && (
        <View style={styles.tileOverlay}>
          <Text style={styles.tileSpecies} numberOfLines={1}>
            {item.speciesName}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────

export default function PlantGalleryScreen() {
  const images = usePlantImages();
  const [activeCategory, setActiveCategory] = useState<PlantCategory | "All">("All");

  // Count per category
  const counts = Object.fromEntries(
    CATEGORIES.map((c) => [c.key, images.filter((i) => i.category === c.key).length])
  ) as Record<PlantCategory, number>;

  const filtered =
    activeCategory === "All"
      ? images
      : images.filter((i) => i.category === activeCategory);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Plant Gallery</Text>
        <Text style={styles.headerSub}>{images.length} specimens collected</Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.pillRow}
      >
        {/* "All" pill */}
        <TouchableOpacity
          style={[styles.pill, activeCategory === "All" && styles.pillAll]}
          onPress={() => setActiveCategory("All")}
          activeOpacity={0.75}
        >
          <Text style={styles.pillEmoji}>🌍</Text>
          <Text style={[styles.pillLabel, activeCategory === "All" && styles.pillLabelActive]}>
            All
          </Text>
          <View style={[styles.badge, activeCategory === "All" && styles.badgeAll]}>
            <Text style={[styles.badgeText, activeCategory === "All" && styles.badgeTextActive]}>
              {images.length}
            </Text>
          </View>
        </TouchableOpacity>

        {CATEGORIES.filter((c) => counts[c.key] > 0 || true).map((cat) => (
          <CategoryPill
            key={cat.key}
            category={cat}
            active={activeCategory === cat.key}
            count={counts[cat.key]}
            onPress={() =>
              setActiveCategory(activeCategory === cat.key ? "All" : cat.key)
            }
          />
        ))}
      </ScrollView>

      {/* Grid */}
      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔬</Text>
          <Text style={styles.emptyTitle}>No specimens yet</Text>
          <Text style={styles.emptyText}>
            Capture images in the camera screen and assign them a category.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          renderItem={({ item }) => <ImageTile item={item} />}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#f8faf7",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: "Georgia",
    fontSize: 28,
    fontWeight: "700",
    color: "#1a2e1a",
    letterSpacing: 0.3,
  },
  headerSub: {
    fontSize: 13,
    color: "#6b7c6b",
    marginTop: 2,
  },

  // Pills
  pillRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexDirection: "row",
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#d1ddd1",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  pillAll: {
    backgroundColor: "#1a2e1a",
    borderColor: "#1a2e1a",
  },
  pillEmoji: {
    fontSize: 13,
  },
  pillLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3a4e3a",
  },
  pillLabelActive: {
    color: "#fff",
  },
  badge: {
    backgroundColor: "#e8f0e8",
    borderRadius: 10,
    minWidth: 18,
    paddingHorizontal: 5,
    paddingVertical: 1,
    alignItems: "center",
  },
  badgeActive: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  badgeAll: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#3a5a3a",
  },
  badgeTextActive: {
    color: "#fff",
  },

  // Grid
  grid: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  row: {
    gap: 6,
    marginBottom: 6,
  },
  tile: {
    width: THUMB,
    height: THUMB,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#e0e8e0",
  },
  tilePressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  tileOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(10,30,10,0.55)",
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  tileSpecies: {
    fontSize: 9,
    color: "#e8f5e8",
    fontStyle: "italic",
    fontWeight: "500",
  },

  // Empty state
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 10,
  },
  emptyEmoji: {
    fontSize: 48,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a2e1a",
    fontFamily: "Georgia",
  },
  emptyText: {
    fontSize: 14,
    color: "#6b7c6b",
    textAlign: "center",
    lineHeight: 20,
  },
});