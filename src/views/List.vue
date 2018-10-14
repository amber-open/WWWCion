<template>
  <v-app id="inspire">
    <!-- <v-navigation-drawer v-model="drawer" fixed app>
      <v-list dense>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon>home</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Home</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer> -->
    <v-toolbar color="indigo" dark fixed app>
      <!-- <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon> -->
      <v-toolbar-title>Title</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>Link One</v-btn>
        <v-btn flat>Link Two</v-btn>
        <v-btn flat>Link Three</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <v-container fluid fill-height>
        <v-layout justify-center align-center>
          <v-flex text-xs-center>
            <v-layout v-bind="binding" row justify-space-around>
              <v-flex mb-3 xs12 sm5 md4 lg3 xl3>
                <v-card dark color="primary">
                  <v-card-text class="pa-1">
                    <h3 class="headline pt-2">11111</h3>
                    <v-layout align-center justify-space-around>
                      <v-btn color="accent" flat  @click="dialog = true">转账</v-btn>
                      <v-btn color="accent" flat  @click="dialog = true">提现</v-btn>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
              <v-flex mb-3 xs12 sm5 md4 lg3 xl3>
                <v-card dark color="secondary">
                  <v-card-text class="pa-1">
                    <h3 class="headline pt-2">11111</h3>
                    <v-layout align-center justify-space-around>
                      <v-btn color="accent" flat  @click="dialog = true">转账</v-btn>
                      <v-btn color="accent" flat  @click="dialog = true">提现</v-btn>
                    </v-layout>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>

            <list-table/>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>

    <v-footer color="indigo" app>
      <span class="white--text">&emsp;&copy; 2018</span>
    </v-footer>


    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-card-title class="title error--text grey lighten-2" primary-title>
          转积分给商家
        </v-card-title>

        <v-card-text class="px-5">
          <v-text-field v-model="address" label="地址" required></v-text-field>
          <v-text-field v-model="number" label="数量" required></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" flat @click="dialog = false">
            取消
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" flat @click="dialog = false">
            转账
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-app>
</template>

<script>
  import listTable from '../components/Table.vue'
  export default {
    components: {
      listTable
    },
    data: () => ({
      drawer: null,
      dialog: false,
      address: '',
      number: null
    }),
    computed: {
      binding () {
        const binding = {}
        if (this.$vuetify.breakpoint.xs) binding.column = true
        return binding
      }
    },
    props: {
      source: String
    }
  }
</script>

<style scoped>
  body{
    padding-top: 20px;
  }
</style>
