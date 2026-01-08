import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  ComponentRef,
} from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Location from "expo-location";
import { AppleMaps, GoogleMaps } from "expo-maps";
import { GoogleMapsMarker as GoogleMapsViewProps } from "expo-maps/build/google/GoogleMaps.types";
import { Platform, StyleSheet, Pressable, Text, View } from "react-native";
import MaterialCommunityIcon from "@expo/vector-icons/MaterialCommunityIcons";

import { FilterComponent } from "@components/FilterComponent";
import UsabilityContext from "@contexts/usability";
import * as interfaces from "@interfaces/index";
import AuthenticationContext from "@contexts/authentication";
import * as Services from "@services/index";

export default function MapScreen() {
  const { showFilter, setShowFilter, selectedFilters } =
    useContext(UsabilityContext);
  const { profileData, setProfileInfo } = useContext(AuthenticationContext);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [location, setLocation] = useState<null | Location.LocationObject>(
    null
  );
  const [locations, setLocations] = useState<GoogleMapsViewProps[]>([]);
  const [cameraPosition, setCameraPosition] = useState<{
    zoom: number;
    coordinates: { latitude: number; longitude: number };
  }>({
    zoom: 12,
    coordinates: { latitude: 37.78825, longitude: -122.4324 },
  });
  const mapRef = useRef<ComponentRef<typeof GoogleMaps.View>>(null);

  async function requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.LocationAccuracy.Highest,
          timeInterval: 1000,
          distanceInterval: 1,
        },
        (location) => {
          setLocation(location);
          if (
            !cameraPosition.coordinates.latitude ||
            cameraPosition.coordinates.latitude === 37.78825
          ) {
            setCameraPosition({
              zoom: 12,
              coordinates: {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              },
            });
          }
        }
      );
    } catch (error) {
      console.error("Error requesting location permission:", error);
      setErrorMsg("Not authorized to use location services.");
    }
  }

  async function getAllLocations() {
    try {
      const response = await Services.CommunityCaresService.getLocations();
      let filteredLocations = response?.data.payload;

      if (selectedFilters.length > 0) {
        filteredLocations = filteredLocations.filter(
          (loc: interfaces.LocationsProps) => selectedFilters.includes(loc.type)
        );
      }

      const locationsMarkers: GoogleMapsViewProps[] = filteredLocations.map(
        (loc: interfaces.LocationsProps) => ({
          id: String(loc.id),
          title: loc.name,
          snippet: loc.address,
          coordinates: {
            latitude: parseFloat(loc.coords.latitude),
            longitude: parseFloat(loc.coords.longitude),
          },
        })
      );
      setLocations(locationsMarkers);
    } catch (error) {
      console.error("Unable to retrieve Locations /getAllLocations", error);
    }
  }

  async function getGitHubUserData() {
    await Services.GitHubService.getUserData()
      .then((res: interfaces.UserDataProps | undefined) => {
        if (res) {
          setProfileInfo({
            name: res.name,
            avatar_url: res.avatar_url,
            bio: res.bio,
            login: res.login,
            location: res.location,
          });
        }
      })
      .catch((err: unknown) => {
        console.error("Failed to retrieve profile data", err);
      });
  }

  useEffect(() => {
    getAllLocations();
    getGitHubUserData();
    requestLocationPermission();
  }, []);

  useEffect(() => {
    getAllLocations();
  }, [selectedFilters]);

  if (Platform.OS === "ios") {
    return <AppleMaps.View style={{ flex: 1 }} />;
  } else if (Platform.OS === "android") {
    if (typeof errorMsg === "string") {
      <View style={styles.errorMessageWrapper}>
        <Text style={styles.errorMessageText}>{errorMsg}</Text>
      </View>;
    }

    return (
      <>
        {showFilter && <FilterComponent />}
        <Pressable
          style={styles.locationCenterButton}
          onPress={() => {
            if (location) {
              setCameraPosition({
                zoom: 12.0001,
                coordinates: {
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                },
              });
              setTimeout(() => {
                setCameraPosition({
                  zoom: 12,
                  coordinates: {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  },
                });
              }, 50);
            }
          }}
        >
          <MaterialCommunityIcon
            size={24}
            color="#C76E16"
            name="navigation-variant"
          />
        </Pressable>
        
        <View style={styles.navigationComponent}>
          <Pressable
            onPress={() => {
              router.navigate("profile");
            }}
            style={styles.navigationButton}
          >
            <Image
              source={profileData?.avatar_url}
              style={styles.profilePicture}
            />
          </Pressable>
          <Text style={styles.navigationComponentBrand}>Community Cares</Text>
          <Pressable
            style={styles.navigationButton}
            onPress={() => {
              setShowFilter(true);
            }}
          >
            <MaterialCommunityIcon name="filter" size={24} color="#FFFF" />
          </Pressable>
        </View>
        
        <GoogleMaps.View
          ref={mapRef}
          cameraPosition={cameraPosition}
          style={StyleSheet.absoluteFill}
          markers={locations}
        />
      </>
    );
  } else {
    return <Text>Maps are only available on Android and iOS</Text>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingLocationComponent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  navigationComponent: {
    zIndex: 1,
    width: "80%",
    height: 56,
    backgroundColor: "#FFF8F0",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 64,
    alignItems: "center",
    paddingHorizontal: 16,
    marginInline: "auto",
    alignSelf: "center",
    alignContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  navigationComponentBrand: {
    fontFamily: "Montserrat_900Black",
    color: "#C76E16",
  },
  navigationButton: {
    backgroundColor: "#C76E16",
    borderRadius: 100,
    padding: 8,
    position: "relative",
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  profilePicture: {
    zIndex: 2,
    width: 28,
    height: 28,
    borderRadius: 100,
  },
  locationCenterButton: {
    borderRadius: 100,
    backgroundColor: "#FFF8F0",
    position: "absolute",
    bottom: 128,
    left: 24,
    width: 40,
    height: 40,
    zIndex: 1,
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.8,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  markerContainer: {
    padding: 16,
    alignItems: "center",
    borderRadius: 100,
  },
  establishmentHeadlineWrapper: {
    flexDirection: "row",
    gap: 16,
    borderRadius: 12,
  },
  establishmentIcon: {
    borderRadius: 100,
    backgroundColor: "#EB841A",
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  establishmentName: {
    fontFamily: "Shrikhand_400Regular",
    fontSize: 12,
    color: "#EB841A",
  },
  establishmentAddress: {
    fontSize: 8,
    color: "#9F9B9B",
    flexWrap: "wrap",
    width: "80%",
  },
  establishmentHeadline: {},
  establishmentContactWrapper: {
    marginTop: 24,
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
  },
  establishmentContactInfo: {
    flexDirection: "column",
  },
  establishmentContactText: {
    fontFamily: "Montserrat_800ExtraBold",
    color: "#9F9B9B",
  },
  setDirectionsButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  setDirectionsButtonText: {
    color: "#EB841A",
    fontFamily: "Montserrat_200ExtraLight",
    fontSize: 8,
  },
  errorMessageWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorMessageText: {
    fontSize: 18,
    textAlign: "center",
  },
});
