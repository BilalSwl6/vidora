import { Stack } from 'expo-router';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Search, Bell, Cast } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function HomeHeader() {
  return (
    <SafeAreaView edges={['top']} style={styles.headerContainer}>
      <View style={styles.header}>
        <View style={styles.searchBar}>
          <Search size={20} color="#757575" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#757575"
            style={styles.searchInput}
          />
        </View>
        <TouchableOpacity style={styles.iconButton}>
          <Cast size={24} color="#212121" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Bell size={24} color="#212121" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

export default function HomeLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <HomeHeader />,
      }}
    >
      <Stack.Screen name="index" />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 0.5,
    borderBottomColor: '#E0E0E0',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
  },
  iconButton: {
    padding: 8,
  },
});