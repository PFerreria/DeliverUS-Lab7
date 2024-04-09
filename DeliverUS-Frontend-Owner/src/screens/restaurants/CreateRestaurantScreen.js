/* eslint-disable react/prop-types */
import { React, useEffect, useState } from 'react'
import TextRegular from '../../components/TextRegular'
import InputItem from '../../components/InputItem'
import * as GlobalStyles from '../../styles/GlobalStyles'
import { Formik } from 'formik'
import { Image, Platform, Pressable, ScrollView, StyleSheet, View, showMessage } from 'react-native'
import * as ExpoImagePicker from 'expo-image-picker'
import restaurantLogo from '../../../assets/restaurantLogo.jpeg'
import restaurantBackground from '../../../assets/restaurantBackground.jpeg'
import DropDownPicker from 'react-native-dropdown-picker'
import { getRestaurantCategories } from '../../services/restaurantService'

export default function CreateRestaurantScreen () {
  const initialRestaurantValues = { name: null, description: null, address: null, postalCode: null, url: null, shippingCosts: null, email: null, phone: null, restaurantCategoryId: null }

  const [restaurantCategories, setRestaurantCategories] = useState([])

  const [open, setOpen] = useState(false)

  useEffect(() => {
    async function fetchRestaurantCategories () {
      try {
        const fetchedRestaurantCategories = await getRestaurantCategories()
        const fetchedRestaurantCategoriesReshaped = fetchedRestaurantCategories.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        setRestaurantCategories(fetchedRestaurantCategoriesReshaped)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurant categories. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchRestaurantCategories()
  }, [])

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!')
        }
      }
    })()
  }, [])

  const pickImage = async (onSuccess) => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1
    })
    if (!result.canceled) {
      if (onSuccess) {
        onSuccess(result)
      }
    }
  }

  return (
    <Formik
    initialValues={initialRestaurantValues}
    >
      {({ setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='name'
                label='Name:'
                placeholder='Enter the name of the restaurant'
              />
              <InputItem
                name='description'
                label='Description:'
                placeholder='Enter the description of the restaurant'
              />
              <InputItem
                name='address'
                label='Address:'
                placeholder='Enter the address of the restaurant'
              />
              <InputItem
                name='postalCode'
                label='Postal code:'
                placeholder='Enter the postal code of the restaurant'
              />
              <InputItem
                name='url'
                label='URL:'
                placeholder='Enter the URL of the restaurant'
              />
              <InputItem
                name='shippingCosts'
                label='Shipping costs:'
                placeholder='Enter the shipping costs of the restaurant'
              />
              <InputItem
                name='email'
                label='Email:'
                placeholder='Enter the email of the restaurant'
              />
              <InputItem
                name='phone'
                label='Phone:'
                placeholder='Enter the phone of the restaurant'
              />

              <DropDownPicker
                open={open}
                value={values.restaurantCategoryId}
                items={restaurantCategories}
                setOpen={setOpen}
                onSelectItem={ item => {
                  setFieldValue('restaurantCategoryId', item.value)
                }}
                setItems={setRestaurantCategories}
                placeholder="Select the restaurant category"
                containerStyle={{ height: 40, marginTop: 20 }}
                style={{ backgroundColor: GlobalStyles.brandBackground }}
                dropDownStyle={{ backgroundColor: '#fafafa' }}
              />

              <Pressable onPress={() =>
                pickImage(
                  async result => {
                    await setFieldValue('logo', result)
                  }
                )
              }
                style={styles.imagePicker}
              >
                <TextRegular>Logo: </TextRegular>
                <Image style={styles.image} source={values.logo ? { uri: values.logo.assets[0].uri } : restaurantLogo} />
              </Pressable>

              <Pressable onPress={() =>
                pickImage(
                  async result => {
                    await setFieldValue('hero', result)
                  }
                )
              }
                style={styles.imagePicker}
              >
                <TextRegular>Hero: </TextRegular>
                <Image style={styles.image} source={values.logo ? { uri: values.logo.assets[0].uri } : restaurantBackground} />
              </Pressable>

              <Pressable
                onPress={() => console.log('Button pressed')
                }
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandPrimaryTap
                      : GlobalStyles.brandPrimary
                  },
                  styles.button
                ]}>
                <TextRegular textStyle={styles.text}>
                  Create restaurant
                </TextRegular>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: GlobalStyles.brandSecondary,
    textAlign: 'center'
  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  }
})
