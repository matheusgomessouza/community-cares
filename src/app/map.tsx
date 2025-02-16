import MapView, {
  Marker,
  Callout,
} from "react-native-maps";
import { Image } from "expo-image";
import { router } from "expo-router";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, useState, useRef } from "react";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";
import MapViewDirections from "react-native-maps-directions";
import MaterialCommunityIcon from "react-native-vector-icons/MaterialCommunityIcons";

import { MenuOverlayComponent } from "@components/MenuOverlayComponent";
import UsabilityContext from "@contexts/usability";
import * as interfaces from "@interfaces/index";
import AuthenticationContext from "@contexts/authentication";
import * as Services from "@services/index";
import { AchievementToastComponent } from "@components/AchievementToastComponent";

export default function MapScreen() {
  const { showFilter, setShowFilter, foreignUser } =
    useContext(UsabilityContext);
  const { profileData, setProfileInfo } = useContext(AuthenticationContext);
  const [errorMsg, setErrorMsg] = useState<null | string>(null);
  const [location, setLocation] = useState<null | Location.LocationObject>(
    null
  );
  const [locations, setLocations] = useState<Array<interfaces.LocationsProps>>(
    []
  );
  const mapRef = useRef<MapView>(null);
  const [showDirection, setShowDirection] =
    useState<interfaces.DestinationDirectionProps>(
      {} as interfaces.DestinationDirectionProps
    );
  const [achievementUnlocked, setAchievementUnlocked] =
    useState<interfaces.AchievementActionProps>({
      show: false,
      type: "",
    });

  async function requestLocationPermission() {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({
      accuracy: 4,
    });

    if (location) setLocation(location);
    if (!location.coords.longitude && !location.coords.latitude) {
      setErrorMsg("Error during location calculation");
    }
  }

  async function getAllLocations() {
    try {
      const response = await Services.CommunityCaresService.getLocations();
      setLocations(response?.data);
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

  function handleCenterLocation() {
    Location.watchPositionAsync(
      {
        accuracy: Location.LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          center: response.coords,
        });
      }
    );
  }

  function defineMarkerIcon(locationType: string): string {
    switch (locationType) {
      case interfaces.EstablishmentTypeProps.CommunityKitchen:
        return "countertop";
      case interfaces.EstablishmentTypeProps.SolidarityKitchen:
        return "silverware-spoon";
      case interfaces.EstablishmentTypeProps.Shelter:
        return "home";
      case interfaces.EstablishmentTypeProps.Hospital:
        return "hospital-box";
      default:
        return "";
    }
  }

  useEffect(() => {
    requestLocationPermission();
  }, [location]);

  useEffect(() => {
    getAllLocations();
    getGitHubUserData();
    Location.watchPositionAsync(
      {
        accuracy: Location.LocationAccuracy.Highest,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      (response) => {
        setLocation(response);
        mapRef.current?.animateCamera({
          center: response.coords,
        });
      }
    );
  }, []);

  useEffect(() => {
    if (achievementUnlocked.show === true) {
      setTimeout(
        () =>
          setAchievementUnlocked((previousState) => ({
            ...previousState,
            show: false,
          })),
        2000
      );
    }
  }, [achievementUnlocked.show]);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" translucent />

      {showFilter && <MenuOverlayComponent />}

      <Pressable
        style={styles.locationCenterButton}
        onPress={() => handleCenterLocation()}
      >
        <MaterialCommunityIcon
          size={24}
          color="#EB841A"
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
          <MaterialCommunityIcon name="magnify" size={24} color="#FFFF" />
        </Pressable>
      </View>

      {achievementUnlocked.show && (
        <AchievementToastComponent
          iconName={
            achievementUnlocked.type === "crosshairs-gps"
              ? interfaces.AchievementsProps.TRACE_LOCATION
              : interfaces.AchievementsProps.KNOW_LOCATION_INFO
          }
          achievementDescription={
            achievementUnlocked.type === "crosshairs-gps"
              ? "Hey! Do you wanna a bite?"
              : "Hmmm, show me more details about this!"
          }
        />
      )}

      {typeof errorMsg === "string" ? (
        <View style={styles.errorMessageWrapper}>
          <Text style={styles.errorMessageText}>{errorMsg}</Text>
        </View>
      ) : (
        <>
          {location ? (
            <MapView
              ref={mapRef}
              region={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              style={styles.map}
            >
              {process.env.EXPO_PUBLIC_GOOGLE_API_KEY && showDirection.show && (
                <MapViewDirections
                  origin={location.coords}
                  destination={{
                    latitude: Number(
                      locations[showDirection.directionIndex].coords.latitude
                    ),
                    longitude: Number(
                      locations[showDirection.directionIndex].coords.longitude
                    ),
                  }}
                  apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY}
                  strokeWidth={4}
                  strokeColor="orange"
                />
              )}
              <Marker coordinate={location.coords} title="You are here" />
              {locations.map((marker, index) => (
                <Marker
                  pinColor="#EB841A"
                  key={index}
                  coordinate={{
                    latitude: Number(marker.coords.latitude),
                    longitude: Number(marker.coords.longitude),
                  }}
                  title={marker.name}
                  description={marker.type}
                  onPress={() =>
                    setAchievementUnlocked({
                      ...achievementUnlocked,
                      show: true,
                      type: "information",
                    })
                  }
                >
                  <Callout
                    onPress={() => {
                      setShowDirection({
                        ...showDirection,
                        show: true,
                        directionIndex: index,
                      });

                      setAchievementUnlocked({
                        ...achievementUnlocked,
                        show: true,
                        type: "crosshairs-gps",
                      });
                    }}
                  >
                    <View style={styles.markerContainer}>
                      <View style={styles.establishmentHeadlineWrapper}>
                        <View style={styles.establishmentIcon}>
                          <MaterialCommunityIcon
                            size={16}
                            name={defineMarkerIcon(marker.type)}
                            color="#FFF"
                          />
                        </View>
                        <View style={styles.establishmentHeadline}>
                          <Text style={styles.establishmentName}>
                            {marker.name}
                          </Text>
                          <Text style={styles.establishmentAddress}>
                            {marker.address}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.establishmentContactWrapper}>
                        <View style={styles.establishmentContactInfo}>
                          <Text style={styles.establishmentContactText}>
                            <MaterialCommunityIcon
                              size={24}
                              name="cellphone-basic"
                              color="#9F9B9B"
                            />{" "}
                            {marker.contact}
                          </Text>
                          <Text style={styles.establishmentContactText}>
                            <MaterialCommunityIcon
                              size={24}
                              name="whatsapp"
                              color="#9F9B9B"
                            />{" "}
                            {marker.contact}
                          </Text>
                        </View>
                        <Pressable style={styles.setDirectionsButtonContainer}>
                          <MaterialCommunityIcon
                            size={32}
                            name="directions"
                            color="#EB841A"
                          />
                          <Text style={styles.setDirectionsButtonText}>
                            Set directions
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  </Callout>
                </Marker>
              ))}
            </MapView>
          ) : (
            <View style={styles.loadingLocationComponent}>
              <Text>
                {foreignUser
                  ? "Loading your current location..."
                  : "Carregando sua localização atual..."}
              </Text>
            </View>
          )}
        </>
      )}
    </View>
  );
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
    backgroundColor: "#FFF",
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 64,
    alignItems: "center",
    paddingHorizontal: 16,
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
    color: "#EB841A",
  },
  navigationButton: {
    backgroundColor: "#EB841A",
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
    backgroundColor: "#FFF",
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
