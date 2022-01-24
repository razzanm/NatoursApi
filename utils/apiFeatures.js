class TourGetFeatures {
    constructor(query, uriQuery) {
      this.query = query;
      this.uriQuery = uriQuery;
    }
  
    filter() {
      const queryObj = { ...this.uriQuery };
      const execuleFields = ['page', 'sort', 'limit', 'fields'];
      execuleFields.forEach((el) => delete queryObj[el]);
      //advance filterings
      let queryStr = JSON.stringify(queryObj);
      queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
      // console.log(queryStr);
  
      //declare query
      this.query = this.query.find(JSON.parse(queryStr));
      return this;
    }
  
    sort() {
      if (this.uriQuery.sort) {
        const sortby = this.uriQuery.sort.split(',').join(' ');
        console.log(sortby);
        this.query = this.query.sort(sortby);
      } else {
        this.query = this.query.sort('-createdAt');
      }
      return this;
    }
  
    limitFields() {
      if (this.uriQuery.fields) {
        const filterby = this.uriQuery.fields.split(',').join(' ');
        console.log(filterby);
        this.query = this.query.select(filterby);
      } //  else {
      //   this.query = this.query.select();
      // }
      return this;
    }
  
    paginations(count) {
      if (this.uriQuery.page && this.uriQuery.limit) {
        const page = this.uriQuery.page * 1 || 1;
        const limit = this.uriQuery.limit * 1 || 100;
        const skip = (page - 1) * limit;
  
        this.query = this.query.skip(skip).limit(limit);
  
        if (skip >= count) throw new Error('The page does not exist');
      }
      return this;
    }
  
    getlimiteddata() {
      if (this.uriQuery.limit) {
        const limited = this.uriQuery.limit * 1;
        console.log(limited);
        this.query.limit(limited);
      }
      return this;
    }
  }

  module.exports = TourGetFeatures;