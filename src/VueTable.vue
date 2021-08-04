<template>
  <div v-if="totalItems" class="vue-table">
    <div>
      <input class="input" placeholder="Search..." @input="handleSearch" />
    </div>
    <table class="fl-table" v-if="filteredData.length">
      <tr>
        <th v-for="header in headers" v-bind:key="header.dataIndex">
          {{ header.title || "" }}
        </th>
      </tr>
      <tr v-for="row in getData" v-bind:key="row.id">
        <td v-for="header in headers" v-bind:key="header.dataIndex">
          {{ row[header.dataIndex] || "" }}
        </td>
      </tr>
    </table>
    <div class="no-data" v-if="!filteredData.length">No Data</div>
    <div
      class="pagination"
      v-if="showPagination"
    >
      <div v-for="i in iterablePage" v-bind:key="i">
        <button
          v-if="i + paginationItemStartIndex <= totalItems"
          class="pagination_item"
          @click="() => handlePaginationClick(i + paginationItemStartIndex)"
        >
          {{ i + paginationItemStartIndex }}
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    data: {
      type: Array,
    },
    headers: {
      type: Array,
    },
    itemsPerRow: {
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      filteredData: [],
      totalItems: 0,
      noOfPageToDisplay: 0,
      totalNoOfPage: 0,
      paginationItemStartIndex: 0,
      currentPage: 1,
      maxNoOfPage: 6,
      iterablePage: 0,
    };
  },
  created() {
    this.filteredData = this.data;
    if (this.filteredData && this.filteredData.length) {
      const totalNoOfPage = Math.ceil(
        this.filteredData.length / this.itemsPerRow
      );
      this.totalNoOfPage = totalNoOfPage;
      this.noOfPageToDisplay =
        totalNoOfPage > this.maxNoOfPage ? this.maxNoOfPage : totalNoOfPage;
      this.totalItems = this.filteredData.length;
      this.iterablePage =
        totalNoOfPage > this.maxNoOfPage ? this.maxNoOfPage : totalNoOfPage;
    }
  },
  computed: {
    getData() {
      return this.filteredData.slice(
        (this.currentPage - 1) * this.itemsPerRow,
        this.itemsPerRow * this.currentPage
      );
    },
    showPagination() {
      return this.filteredData.length && this.itemsPerRow < this.totalItems && this.iterablePage > 1
    }
  },
  watch: {
    filteredData: function (data) {
      if (data && data.length) {
        const totalNoOfPage = Math.ceil(data.length / this.itemsPerRow);

        this.iterablePage =
          totalNoOfPage > this.maxNoOfPage ? this.maxNoOfPage : totalNoOfPage;
      }
    },
  },
  methods: {
    handlePaginationClick(page) {
      if (
        page > this.currentPage &&
        page == this.maxNoOfPage + this.paginationItemStartIndex &&
        this.totalNoOfPage > page
      ) {
        this.noOfPageToDisplay =
          this.totalNoOfPage > this.noOfPageToDisplay + 3
            ? this.noOfPageToDisplay + 3
            : this.totalNoOfPage;
        this.paginationItemStartIndex = this.paginationItemStartIndex + 2;
      }

      if (
        page < this.maxNoOfPage + this.paginationItemStartIndex &&
        page === this.paginationItemStartIndex + 1 &&
        this.paginationItemStartIndex - 1 >= 0
      ) {
        this.paginationItemStartIndex = this.paginationItemStartIndex - 1;
      }

      this.currentPage = page;
    },
    handleSearch(e) {
      this.debounce(e.target.value, (keyword) => {
        this.filteredData = this.data.filter((rowData) => {
          let isFound = false;

          if (rowData) {
            Object.values(rowData).map((rowDataValues) => {
              if (
                rowDataValues &&
                `${rowDataValues}`
                  .toLowerCase()
                  .indexOf(keyword.toLowerCase()) !== -1
              )
                isFound = true;
            });
          }

          if (isFound) return rowData;
        });

        this.currentPage = 1;
      });
    },
    debounce(value, callback) {
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        callback(value);
      }, 300);
    },
  },
};
</script>
<style scoped>
.vue-table {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 10px 0;
}

.no-data {
  margin: 10px;
}

.input {
  outline: none;
  padding: 7px 15px;
  border-radius: 5px;
  border: 1px solid gray;
}

.table-wrapper {
  margin: 10px 70px 70px;
  box-shadow: 0px 35px 50px rgba(0, 0, 0, 0.2);
}

.fl-table {
  border-radius: 5px;
  font-size: 12px;
  font-weight: normal;
  border: none;
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  white-space: nowrap;
  background-color: white;
  margin: 30px;
}

.fl-table td,
.fl-table th {
  text-align: center;
  padding: 8px;
}

.fl-table td {
  border-right: 1px solid #f8f8f8;
  font-size: 12px;
}

.fl-table thead th {
  color: #ffffff;
  background: #4fc3a1;
}

.fl-table thead th:nth-child(odd) {
  color: #ffffff;
  background: #324960;
}

.fl-table tr:nth-child(even) {
  background: #f8f8f8;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination_item {
  margin: 5px 3px;
}
</style>

