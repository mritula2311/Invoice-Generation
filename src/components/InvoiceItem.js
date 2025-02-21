import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Button } from 'react-bootstrap';
import { BiTrash } from 'react-icons/bi';
import EditableField from './EditableField';

const InvoiceItem = ({ items, onItemizedItemEdit, onRowAdd, onRowDel, currency }) => {
  return (
    <div>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th className="text-center">ITEM</th>
            <th className="text-center">QTY</th>
            <th className="text-center">PRICE</th>
            <th className="text-center">TOTAL</th>
            <th className="text-center">ACTION </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <ItemRow key={item.id} item={item} onItemizedItemEdit={onItemizedItemEdit} onDelEvent={onRowDel} currency={currency} />
          ))}
        </tbody>
      </Table>
      <Button className="fw-bold" onClick={onRowAdd}>Add Item</Button>
    </div>
  );
};

const ItemRow = ({ item, onItemizedItemEdit, onDelEvent, currency }) => {
  return (
    <tr>
      <td>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: 'text',
            name: 'name',
            placeholder: 'Item name',
            value: item.name,
            id: item.id,
          }}
        />
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: 'text',
            name: 'description',
            placeholder: 'Item description',
            value: item.description,
            id: item.id,
          }}
        />
      </td>
      <td>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            type: 'number',
            name: 'quantity',
            min: 1,
            value: item.quantity,
            id: item.id,
          }}
        />
      </td>
      <td>
        <EditableField
          onItemizedItemEdit={onItemizedItemEdit}
          cellData={{
            leading: currency,
            type: 'number',
            name: 'price',
            min: 1,
            value: item.price,
            id: item.id,
          }}
        />
      </td>
      <td>{currency} {(item.price * item.quantity).toFixed(2)}</td>
      <td className="text-center">
        <Button variant="danger" onClick={() => onDelEvent(item)}>
          <BiTrash className="me-2" /> 
        </Button>
      </td>
    </tr>
  );
};

export default InvoiceItem;
